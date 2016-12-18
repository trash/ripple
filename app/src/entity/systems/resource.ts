import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IResourceState} from '../components/resource';
import {IHarvestableState} from '../components/harvestable';
import {IRenderableState} from '../components/renderable';
import {IPositionState} from '../components/position';
import {INameState} from '../components/name';
import {IHealthState} from '../components/health';
import {util} from '../../util';
import {constants} from '../../data/constants';
import {TilemapSprite} from '../../tilemap';
import {spriteManager} from '../../services/sprite-manager';

export class ResourceSystem extends EntitySystem {
    readonly updateInterval = 10;

    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Renderable, id) as IRenderableState,
                harvestableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Harvestable, id) as IHarvestableState,
                healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState,
                resourceState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Resource, id) as IResourceState,
                nameState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Name, id) as INameState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            this.handleInit(resourceState, renderableState, positionState);

            renderableState.sprite.tint = harvestableState.highlighted || harvestableState.queued ?
                constants.colors.BLUE_GREEN :
                constants.colors.WHITE;

            if (!nameState.name) {
                nameState.name = resourceState.name;
            }

            if (healthState.currentHealth <= 0) {
                console.info('Should be getting rid of resource sprites', id);
                spriteManager.destroy(renderableState.spriteGroup as TilemapSprite);
            }
        });
    }

    getSpriteName (resourceState: IResourceState): string {
        const spriteKey = resourceState.spriteKey;
        let spriteName: string;

        if (spriteKey instanceof Array) {
			spriteName = util.randomFromList(spriteKey);
		} else if (spriteKey instanceof Object) {
			spriteName = util.randomFromRatios(spriteKey);
		}
        return spriteName;
    }

    handleInit (
        resourceState: IResourceState,
        renderableState: IRenderableState,
        positionState: IPositionState
    ) {
        // Init sprites
        if (!renderableState.spriteGroup) {
            const spriteGroup = spriteManager.createContainer(
                    positionState.tile.column,
                    positionState.tile.row),
                sprite = PIXI.Sprite.fromFrame(this.getSpriteName(resourceState));

            spriteGroup.addChild(sprite);

            renderableState.sprite = sprite;
            renderableState.spriteGroup = spriteGroup;

            const anchor = resourceState.anchor;
            // Optionally adjust sprite anchor
            if (anchor) {
                let anchorX = anchor[0],
                    anchorY = anchor[1];

                sprite.anchor.x = anchorX;
                sprite.anchor.y = anchorY;
            }
            // Init shadow
            const shadow = PIXI.Sprite.fromFrame('shadow');
			shadow.position.y = -5;
			spriteGroup.addChildAt(shadow, 0);
        }
    }
}