import {events} from '../../events';
import * as _ from 'lodash';
import {Component} from '../ComponentEnum';
import {spriteUtil} from '../../util/sprite';
import {BaseUtil} from './base';
import {IAgentState} from '../../entity/components';
import {buildingUtil, positionUtil, itemUtil, inventoryUtil, townUtil, shopUtil, storageUtil} from './index';
import {MapUtil} from '../../map/map-util';
import {PathUtil} from '../../util/path';
import {util} from '../../util';
import {constants} from '../../data/constants';
import {Agent} from '../../data/Agent';
import {StatusBubble} from '../../data/StatusBubble';
import {
	IAgentSearchOptions,
	IRowColumnCoordinates,
	AgentSearchResult,
	Gender
} from '../../interfaces';
import {cacheService} from '../../services/cache';
import {statusBubbleUtil} from './statusBubble';
import {assemblageData} from '../../entity/assemblageData/agents';

export class AgentUtil extends BaseUtil {
    /**
	 * Gets agents search results from the cache and removes any entities
	 * that have been destroyed
	 */
	private getFromCache (
        funcName: string,
        options: IAgentSearchOptions
    ) {
		const cacheResults = cacheService.getValue(funcName, [options]);
		if (!cacheResults) {
			return null;
		}
		return this.filterDeadAgents(cacheResults);
	}

	private filterDeadAgents(agents: number[]): number[] {
		return agents.filter(id => !(id in this.entityManager.removedEntities));
	}

    private getAllAgents (): number[] {
        return this.entityManager.getEntityIdsForComponent(Component.Agent);
    }

	private entityIdToAgentSearchResult (id: number): AgentSearchResult {
		return {
			id: id,
			agent: this._getAgentState(id),
			position: this._getPositionState(id)
		};
	}

	private getBaseSpriteName(
		spriteType: string,
		gender?: Gender,
		spriteIndex?: number
	): string {
		let agentString = spriteType;
        if (gender) {
            agentString += `-${gender}`;
        }
        if (util.isNumberLike(spriteIndex)) {
            agentString += `-${spriteIndex}`;
        }
        return agentString;
	}

	private getSpriteNameWithDirection(
		baseSpriteName: string,
		direction: string
	): string {
        return `${baseSpriteName}-${direction}`;
	}

	getBaseSpriteNameFromState (agentState: IAgentState): string {
        return this.getBaseSpriteName(
			agentState.spriteType,
			agentState.gender,
			agentState.spriteIndex
		);
    }

    getSpriteName (agentState: IAgentState, direction: string) {
        const agentString = this.getBaseSpriteNameFromState(agentState);
		return this.getSpriteNameWithDirection(agentString, direction);
    }

	getImagePath(
		agent: Agent
	): string {
		const assemblageEntry = assemblageData[agent].agent;
		const agentName = assemblageEntry.spriteType || Agent[agent].toLowerCase();
		const baseSpriteName = this.getBaseSpriteName(
			agentName,
			assemblageEntry.genderEnabled ? 'male' : null,
			assemblageEntry.spriteCount ? 1 : null
		);
		const spriteName = this.getSpriteNameWithDirection(baseSpriteName, 'down');
		return `${constants.SPRITE_PATH}monsters/${agentName}/${spriteName}.png`;
	}

	getImagePathFromAgentState(
		agentState: IAgentState
	) {
		const spriteName = this.getSpriteName(agentState, 'down');
		return `${constants.SPRITE_PATH}monsters/${Agent[agentState.enum]}/${spriteName}.png`;
	}

	agentIsDead (id: number): boolean {
		if (id in this.entityManager.removedEntities) {
			return true;
		}
		return this._getAgentState(id).dead;
	}

    getAgentsFromOptions (
        options: IAgentSearchOptions
    ): AgentSearchResult[] {
		const funcName = 'getAgentsFromOptions';
		const cached: number[] = this.getFromCache(funcName, options);
		if (cached) {
			return cached.map(id => this.entityIdToAgentSearchResult(id));
		}
		// We modify the original options below which affectss caching
		var originalOptions = _.extend({}, options);
		const storeToCache = this.getAllAgents().filter(id => {
			const agentData = this._getAgentState(id);
			// Don't return dead agents;
			if (agentData.dead) {
				return false;
			}
			// Special option for making sure the matched agents don't have the
			// given id
			// NOTE: do not check for options.cannotHaveId because this is a deoptimization
			if (id === options.cannotHaveId) {
				return false;
			}
			delete options.cannotHaveId;
			for (const option in options) {
				const agentValue = agentData[option],
					optionValue = options[option];
				// Check for subset matches in array values
				if (agentValue instanceof Array && agentValue.length) {
					if (!_.intersection(agentValue, optionValue).length) {
						return false;
					}
				} else {
					if (agentValue !== optionValue) {
						return false;
					}
				}
			}
			return true;
		});
		// Store in cache for 5 seconds
		cacheService.store(funcName, [originalOptions], storeToCache, 5000);
		return storeToCache.map(id => this.entityIdToAgentSearchResult(id));
	}

    /**
	 * Get closest agent to the given tile matching
	 * the given options.
	 *
	 * @param {Object} options GameMap of options to filter agents against
	 * @param {Tile} tile
	 * @return {Agent} Or null if there's no match
	 */
	getClosestAgentToTile (
        options: IAgentSearchOptions,
        tile: IRowColumnCoordinates,
        distance?: number
    ): AgentSearchResult {
		const agents = this.getAgentsFromOptions(options);

		if (!agents.length) {
			return null;
		}

		// Get the agent based on how close they are to the given tile
		const nearestIndex = MapUtil.nearestTileFromSet(tile,
				agents.map(agentSearchResult => agentSearchResult.position.tile));
		const nearestAgent = agents[nearestIndex];
		// Check to make sure agent is in distance if one is specified
		if (!distance || MapUtil.distanceTo(nearestAgent.position.tile, tile) <= distance) {
			return nearestAgent;
		}
		return null;
	}

	fleeFromTarget (
		turn: number,
		agent: number,
		fleeTarget: number
	) {
		const fleeTargetPositionState = this._getPositionState(fleeTarget);
		const agentData = this._getAgentState(agent);
		const agentPositionState = this._getPositionState(agent);
		const tile = PathUtil.getFleeTile(agentPositionState.tile, fleeTargetPositionState.tile);

		positionUtil.setTile(agentPositionState, tile, turn, agentData.speed);
	}

    attackAgent (
		turn: number,
        attacker: number,
        target: number
    ): boolean {
        const healthState = this._getHealthState(target);
        const targetAgentState = this._getAgentState(target);
        const agentState = this._getAgentState(attacker);
        const targetRenderableState = this._getRenderableState(target);
        const targetHealthBarState = this._getHealthBarState(target);
        const attackerPositionState = this._getPositionState(attacker);
        const targetPositionState = this._getPositionState(target);

        const distanceToTarget = MapUtil.distanceTo(attackerPositionState.tile,
            targetPositionState.tile, true);
		if (distanceToTarget > 1 || targetAgentState.buildingInsideOf) {
            return false;
        }

        // Face the target
        attackerPositionState.direction = positionUtil.directionToTile(
            attackerPositionState.tile,
            targetPositionState.tile);

        const damage = agentState.strength;

		// Update last attacked info
		targetAgentState.lastAttacked = turn;
		targetAgentState.lastAttacker = attacker;

        // Reduce health
        healthState.currentHealth -= damage;

        spriteUtil.showDamageNumber(targetRenderableState.spriteGroup, damage + '', 12, -12);

        // Show health bar then hide it
        targetHealthBarState.shown = true;
        setTimeout(() => {
            targetHealthBarState.shown = false;
        }, 5000);

        return true;
    }

	enterBuilding (
		turn: number,
		agent: number,
		building: number
	) {
		const buildingHealthState = this._getHealthState(building);
		if (buildingHealthState.currentHealth < buildingHealthState.maxHealth) {
			return console.error('We should not allow agents to enter damaged buildings.');
		}

		// Move them onto the building
		const agentState = this._getAgentState(agent);
		const agentPositionState = this._getPositionState(agent);
		const buildingTile = positionUtil.getTileFromEntityId(building);

		agentState.buildingInsideOf = building;
		positionUtil.setTile(agentPositionState, buildingTile, turn, agentState.speed);

		const villagerState = this._getVillagerState(agent);
		if (villagerState && villagerState.home) {
			const sleepState = this._getSleepState(agent);
			sleepState.inHome = true;
		}

		buildingUtil.addOccupant(building, agent);
	}

	eatItem (
		turn: number,
		agent: number,
		item: number
	) {
		const hungerState = this._getHungerState(agent);
		hungerState.value -= constants.foodValue;

		if (hungerState.value < constants.HUNGER.MAX / 3) {
			statusBubbleUtil.removeStatusBubble(agent, StatusBubble.Hunger);
		}

		this.entityManager.destroyEntity(item);
	}

	buyItem(
		agent: number,
		item: number
	) {
		console.log('agent should be buying item', agent, item);
		events.emit(['trigger-sound', 'purchase']);
		const itemState = this._getItemState(item);
		const value = itemState.value;
		// Remove gold from agent
		inventoryUtil.removeGold(agent, value);

		// Show the gold earned by the shop
		buildingUtil.showGoldEarned(value, itemState.stored);

		// Update the town
		townUtil.addGold(value);

		// Make sure item is unclaimed (it's bought by someone not from the town)
		// and has its tile updated
		itemUtil.pickupItem(item);
		itemUtil.unclaim(item);

		// Remove item from proper storage. This might need to be moved somewhere else
		if (itemState.stored) {
			const storageState = this._getStorageState(item);
			const util = storageState ? storageUtil : shopUtil;
			util.remove(item, itemState.stored);
			itemState.stored = null;
		}

		// Add the item to the agent's inventory
		inventoryUtil.add(agent, item);
	}

	dropItem(agent: number, item: number): void {
		// Remove from their inventory
		inventoryUtil.remove(agent, item);
		// And place it on the ground where they are
		const tile = this._getPositionState(agent).tile;
		itemUtil.addToTile(item, tile);
	}
}

export const agentUtil = new AgentUtil();