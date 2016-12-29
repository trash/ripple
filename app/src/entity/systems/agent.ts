import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IAgentState} from '../components/agent';
import {IRenderableState} from '../components/renderable';
import {IHealthState} from '../components/health';
import {IHealthBarState} from '../components/health-bar';
import {IPositionState} from '../components/position';
import {INameState} from '../components/name';
import {IAgentSprite} from '../../interfaces';
import {util} from '../../util';
import {events} from '../../events';
import {names} from '../../names';

export class AgentSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Renderable, id) as IRenderableState,
                agentState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Agent, id) as IAgentState,
                healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState,
                nameState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Name, id) as INameState,
                healthBarState = this.manager.getComponentDataForEntity(
                    ComponentEnum.HealthBar, id) as IHealthBarState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            this.handleInit(agentState, renderableState, positionState);

            // Update the sprite texture every turn
            if (renderableState.sprite) {
                renderableState.sprite.texture = PIXI.Texture.fromFrame(
                    this.getSpriteName(agentState, positionState.direction));
            }
            if (!agentState.inventory) {
                agentState.inventory = [];
            }
            // Show/hide agent based on whether they're in building
            if (agentState.isInBuilding && renderableState.shown) {
                renderableState.shown = false;
            } else if (!agentState.isInBuilding && !renderableState.shown) {
                renderableState.shown = true;
            }
            if (!nameState.name) {
                const newName = names.getName(agentState.agentName, agentState.gender);
                nameState.name = `${newName.first} ${newName.last}`;
            }
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
        renderableState.shown = false;
        this.manager.removeEntity(id);
        this.spawnCorpse(agentState, positionState);
        events.emit(['agent', 'remove'], id);
    }

    spawnCorpse (agentState: IAgentState, positionState: IPositionState) {
        const tile = positionState.tile,
            baseSpriteName = this.getBaseSpriteName(agentState);
        events.emit(['spawn', 'corpse'], {
            corpse: {
                agentBaseSpriteName: baseSpriteName
            },
            position: {
                tile: tile
            }
        });
    }

    handleInit (
        agentState: IAgentState,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
        // Init gender
        if (agentState.genderEnabled && !agentState.gender) {
            agentState.gender = Math.random() > 0.5 ? 'male' : 'female';
        }

        // Init sprites
        if (agentState.spriteCount && !agentState.spriteIndex) {
            agentState.spriteIndex = util.randomInRange(1, agentState.spriteCount);
        }
        if (renderableState.spriteGroup && !renderableState.sprite) {
            renderableState.sprite = this.initAgentSprite(renderableState, agentState, positionState);
        }
    }

    getBaseSpriteName (agentState: IAgentState): string {
        let agentString = agentState.agentName;
        if (agentState.gender) {
            agentString += `-${agentState.gender}`;
        }
        if (_.isNumber(agentState.spriteIndex)) {
            agentString += `-${agentState.spriteIndex}`;
        }
        return agentString;
    }

    getSpriteName (agentState: IAgentState, direction: string) {
        const agentString = this.getBaseSpriteName(agentState);
        return `${agentString}-${direction}`;
    }

    initAgentSprite (
        renderableState: IRenderableState,
        agentState: IAgentState,
        positionState: IPositionState
    ): PIXI.Sprite {
        console.log(`Creating agent sprite at ${positionState.tile}`);

        // The sprite group for the agent
        const spriteGroup = renderableState.spriteGroup;

        const spriteName = this.getSpriteName(agentState, positionState.direction);

        // The actual sprite
        const sprite: IAgentSprite = PIXI.Sprite.fromFrame(spriteName);
        // Set the frame to the default if they specify
        sprite.frame = agentState.defaultSpriteFrame;
        // Enabled input for hover, click, etc.
        sprite.interactive = true;

        spriteGroup.addChild(sprite);

        return sprite;
    }
}