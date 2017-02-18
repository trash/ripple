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
import {ResourceRequirements} from '../../ResourceRequirements';
import {IItemSearchResult} from '../../interfaces';
import {spriteUtil} from '../../util/sprite';
import {spriteManager, SpriteManager} from '../../services/sprite-manager';

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
                constructibleState.resourceRequirements = new ResourceRequirements(
                    constructibleState.requiredResources
                );
                constructibleState.resourceRequirements.on('add',
                    (itemSearchResult: IItemSearchResult) => {
                        this.showAddResourceSprite(itemSearchResult, renderableState, positionState);
                    }
                );
            }
            if (!constructibleState.taskCreated) {
                console.info('Creating building task');
                this.createTask(id);
                constructibleState.taskCreated = true;
            }
        });
    }

    getFloatSpriteCoords (renderableState: IRenderableState) {
        return {
            x: renderableState.spriteGroup.width / 2,
            y: 4
        };
    }

    showAddResourceSprite (
        itemSearchResult: IItemSearchResult,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
		const coords = this.getFloatSpriteCoords(renderableState);
        const itemState = itemSearchResult.state;
		const sprite = spriteManager.create(itemState.name,
            positionState.tile.column, positionState.tile.row, true);

		renderableState.spriteGroup.addChild(sprite);

        const textNode = spriteManager.createText('+1', {
            font: 'bold 16px Lora',
			fill: '#00B200',
			stroke: '#000',
			strokeThickness: 2,
			align: 'center'
        }, positionState.tile.column, positionState.tile.row);
		renderableState.spriteGroup.addChild(textNode);

		[sprite, textNode].forEach((sprite, index) => {
			sprite.position.x = coords.x;
			sprite.position.y = coords.y;
			sprite.anchor.x = index === 0 ? 0.85 : -0.25;
			sprite.anchor.y = 0.5;
			spriteUtil.floatSprite(sprite);
		});
	}

    createTask (id: number) {
        const builderTaskQueue = taskQueueManager.professionTaskQueue(Profession.Builder);
		// Add the build job to the task queue
		builderTaskQueue.push(id);
    }

    isComplete (healthState: IHealthState) {
        return healthState.currentHealth === healthState.maxHealth;
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