import * as _ from 'lodash';;
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {
    IRenderableState,
    IPositionState,
    IHealthBarState,
    IConstructibleState,
    ICollisionState,
    IHealthState
} from '../components';
import {taskQueueManager} from '../../Tasks/TaskQueueManager';
import {Profession} from '../../data/Profession';
import {SpriteManager} from '../../services/spriteManager';
import {constructibleUtil} from '../util';

export class ConstructibleSystem extends EntitySystem {
    update (entityIds: number[]) {
        const manager = this.manager;
        entityIds.forEach(id => {
            const positionState = manager.getComponentDataForEntity(
                Component.Position, id) as IPositionState;
            const healthState = manager.getComponentDataForEntity(
                Component.Health, id) as IHealthState;
            const healthBarState = manager.getComponentDataForEntity(
                Component.HealthBar, id) as IHealthBarState;
            const constructibleState = manager.getComponentDataForEntity(
                Component.Constructible, id) as IConstructibleState;
            const collisionState = manager.getComponentDataForEntity(
                Component.Collision, id) as ICollisionState;
            const renderableState = manager.getComponentDataForEntity(
                Component.Renderable, id) as IRenderableState;
            // Wait for other systems to bootstrap
            if (!renderableState.spriteGroup || !healthBarState.sprites) {
                return;
            }

            if (renderableState.spriteGroup && !constructibleState.completedSprite) {
                this.initSprites(positionState, constructibleState, renderableState);
            }
            if (this.isComplete(healthState)) {
                constructibleState.progressSprite.visible = false;
                constructibleState.completedSprite.visible = true;
            }
            if (healthBarState.sprites.length
                && !constructibleState.healthbarSpritesInitialized
            ) {
                this.initHealthBarSprites(healthBarState, constructibleState);
            }
            if (!constructibleState.resourceRequirements) {
                constructibleUtil.initializeResourceRequirements(
                    constructibleState,
                    renderableState,
                    positionState
                );
            }
            if (!constructibleState.taskCreated) {
                console.info('Creating building task');
                this.createTask(id);
                constructibleState.taskCreated = true;
            }
        });
    }

    createTask (id: number) {
        const builderTaskQueue = taskQueueManager.professionTaskQueue(Profession.Builder);
		// Add the build job to the task queue
		builderTaskQueue.push(id);
    }

    isComplete (healthState: IHealthState) {
        return healthState.currentHealth >= healthState.maxHealth;
    }

    initSprites (
        positionState: IPositionState,
        constructibleState: IConstructibleState,
        renderableState: IRenderableState
    ) {
        // The sprite group for the agent
        const spriteGroup = renderableState.spriteGroup;

        // The actual sprite
        const completedSprite = SpriteManager.Sprite.fromFrame(
            constructibleState.completedSpriteName
        );
        constructibleState.completedSprite = completedSprite;
        completedSprite.visible = false;

        const progressSprite = SpriteManager.Sprite.fromFrame(
            constructibleState.progressSpriteName
        );
        constructibleState.progressSprite = progressSprite;
        const floorSprite = SpriteManager.Sprite.fromFrame(constructibleState.floorSpriteName);
        constructibleState.floorSprite = floorSprite;

        [floorSprite, completedSprite, progressSprite]
            .forEach(sprite => spriteGroup.addChild(sprite));

        renderableState.spriteGroup = spriteGroup;
        renderableState.sprite = completedSprite;
    }

    initHealthBarSprites (healthBarState: IHealthBarState, constructibleState: IConstructibleState) {
        healthBarState.sprites.forEach(healthBar => {
            healthBar.position.x = (constructibleState.completedSprite.width - 68) / 2;
            healthBar.position.y = constructibleState.completedSprite.height + 4;
        });
    }
}