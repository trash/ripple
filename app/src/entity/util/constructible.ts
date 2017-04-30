import {Component} from '../ComponentEnum';
import {
    IConstructibleState,
    IRenderableState,
    IPositionState
} from '../components';
import {events} from '../../events';
import {BaseUtil} from './base';
import {IRowColumnCoordinates, IItemSearchResult} from '../../interfaces';
import {ItemRequirements} from '../../ItemRequirements';
import {spriteUtil} from '../../util/sprite';
import {spriteManager} from '../../services/spriteManager';

export class ConstructibleUtil extends BaseUtil {
    initializeResourceRequirements(
        constructibleState: IConstructibleState,
        renderableState: IRenderableState,
        positionState: IPositionState,
        completed: boolean = false
    ) {
        constructibleState.resourceRequirements = new ItemRequirements(
            constructibleState.requiredResources
        );
        constructibleState.resourceRequirements.on('add',
            (itemSearchResult: IItemSearchResult) => {
                this.showAddResourceSprite(
                    itemSearchResult,
                    renderableState,
                    positionState
                );
            }
        );
        if (completed) {
            constructibleState.resourceRequirements.markAsCompleted();
        }
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

    private getFloatSpriteCoords (renderableState: IRenderableState) {
        return {
            x: renderableState.spriteGroup.width / 2,
            y: 4
        };
    }
}

export const constructibleUtil = new ConstructibleUtil();