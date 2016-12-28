import {ComponentEnum} from '../component-enum';
import {spriteUtil} from '../../util/sprite';
import {BaseUtil} from './base';
import {positionUtil} from './position';
import {MapUtil} from '../../map/map-util';
import {PathUtil} from '../../util/path';
import {util} from '../../util';
import {IAgentSearchOptions, IRowColumnCoordinates, AgentSearchResult} from '../../interfaces';
import {cacheService} from '../../services/cache';

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
        return this.entityManager.getEntityIdsForComponent(ComponentEnum.Agent);
    }

	private entityIdToAgentSearchResult (id: number): AgentSearchResult {
		return {
			id: id,
			agent: this._getAgentState(id),
			position: this._getPositionState(id)
		};
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
		let nearestIndex = MapUtil.nearestTileFromSet(tile,
				agents.map(agentSearchResult => agentSearchResult.position.tile));
		let nearestAgent = agents[nearestIndex];
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

		util.setTile(agentPositionState, tile, turn, agentData.speed);
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
		if (distanceToTarget > 1) {
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
}

export const agentUtil = new AgentUtil();