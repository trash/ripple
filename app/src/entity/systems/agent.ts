import * as _ from 'lodash';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {
    IAgentState,
    IRenderableState,
    IHealthState,
    IHealthBarState,
    IPositionState,
    INameState,
    IBuildingState
} from '../components';
import {IAgentSprite} from '../../interfaces';
import {Util} from '../../util';
import {events} from '../../events';
import {names} from '../../names';
import {SpriteManager} from '../../services/spriteManager';
import {Agent} from '../../data/Agent';
import {renderableUtil, buildingUtil, positionUtil, agentUtil} from '../util';

export class AgentSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                Component.Renderable, id) as IRenderableState;
            const agentState = this.manager.getComponentDataForEntity(
                Component.Agent, id) as IAgentState;
            const healthState = this.manager.getComponentDataForEntity(
                Component.Health, id) as IHealthState;
            const nameState = this.manager.getComponentDataForEntity(
                Component.Name, id) as INameState;
            const healthBarState = this.manager.getComponentDataForEntity(
                Component.HealthBar, id) as IHealthBarState;
            const positionState = this.manager.getComponentDataForEntity(
                Component.Position, id) as IPositionState;

            this.handleInit(agentState, renderableState, positionState);

            // Update the sprite texture every turn
            if (renderableState.sprite) {
                renderableState.sprite.texture = PIXI.Texture.fromFrame(
                    agentUtil.getSpriteName(agentState, positionState.direction)
                );
            }

            // Check to see if the agent left the building they were in
            if (agentState.buildingInsideOf) {
                const buildingTile = positionUtil.getTileFromEntityId(
                    agentState.buildingInsideOf
                );
                if (!Util.rowColumnCoordinatesAreEqual(
                    positionState.tile, buildingTile)
                ) {
                    buildingUtil.removeOccupant(agentState.buildingInsideOf, id);
                    agentState.buildingInsideOf = null;
                }
            }

            // Show/hide agent based on whether they're in building
            if (agentState.buildingInsideOf && renderableState.shown) {
                renderableUtil.setShown(renderableState, false);
                console.log('hide agent', id);
            } else if (!agentState.buildingInsideOf && !renderableState.shown) {
                renderableUtil.setShown(renderableState, true);
                console.log('show agent', id);
            }

            // Init name
            if (!nameState.name) {
                const newName = names.getName(agentState.nameType, agentState.gender);
                nameState.name = `${newName.first} ${newName.last}`;
            }
            // Init health bar sprites
            if (healthBarState.sprites) {
                healthBarState.sprites.forEach(healthBar => {
                    healthBar.position.x = 0;
                    healthBar.position.y = -20;
                });
            }
            // Check if they died
            if (!agentState.dead && healthState.currentHealth <= 0) {
                this.handleDeath(id, agentState, renderableState, positionState);
            }
        });
    }

    handleDeath (
        id: number,
        agentState: IAgentState,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
        console.info(`killing off an agent with id ${id}`);
        agentState.dead = true;
        this.manager.destroyEntity(id);
        this.spawnCorpse(agentState, positionState);
    }

    spawnCorpse (
        agentState: IAgentState,
        positionState: IPositionState
    ) {
        const tile = positionState.tile;
        const baseSpriteName = agentUtil.getBaseSpriteNameFromState(agentState);
        console.info('should be spawning a corpse', baseSpriteName);
        this.manager.spawner.spawnCorpse({
            position: positionState,
            corpse: {
                agentBaseSpriteName: baseSpriteName
            }
        });
    }

    /**
     * Handle cleanup for destroyed agents
     * @param entity
     */
    destroyComponent(
        destroyedEntity: number
    ): void {
        // Remove all references to this agent as lastAttacker
        const entities = this.manager.getEntityIdsForComponent(Component.Agent);
        entities.forEach(entity => {
            const agentState = this.manager.getComponentDataForEntity(Component.Agent, entity);
            if (agentState.lastAttacker === destroyedEntity) {
                agentState.lastAttacker = null;
            }
        });
    }

    handleInit (
        agentState: IAgentState,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
        const enumString = Agent[agentState.enum].toLowerCase();
        // Init agent name from enum
        if (!agentState.spriteType && _.isNumber(agentState.enum)) {
            agentState.spriteType = enumString;
        }

        // Init agent name type. default it to the enum if not specifically defined
        if (!agentState.nameType) {
            agentState.nameType = enumString;
        }

        // Init gender
        if (agentState.genderEnabled && !agentState.gender) {
            agentState.gender = Math.random() > 0.5 ? 'male' : 'female';
        }

        // Init sprites
        if (agentState.spriteCount && !agentState.spriteIndex) {
            agentState.spriteIndex = Util.randomInRange(1, agentState.spriteCount);
        }
        if (renderableState.spriteGroup && !renderableState.sprite) {
            renderableState.sprite = this.initAgentSprite(renderableState, agentState, positionState);
        }
    }

    initAgentSprite (
        renderableState: IRenderableState,
        agentState: IAgentState,
        positionState: IPositionState
    ): PIXI.Sprite {
        console.log(`Creating agent sprite at ${positionState.tile}`);

        // The sprite group for the agent
        const spriteGroup = renderableState.spriteGroup;

        const spriteName = agentUtil.getSpriteName(agentState, positionState.direction);

        // The actual sprite
        const sprite: IAgentSprite = SpriteManager.Sprite.fromFrame(spriteName);
        // Set the frame to the default if they specify
        sprite.frame = agentState.defaultSpriteFrame;
        // Enabled input for hover, click, etc.
        sprite.interactive = true;

        spriteGroup.addChild(sprite);

        return sprite;
    }
}