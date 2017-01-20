import {StatusBubble} from '../../data/status-bubble';
import {ComponentEnum} from '../component-enum';
import {BaseUtil} from './base';
import {IStatusBubbleState} from '../components/status-bubble';

export class StatusBubbleUtil extends BaseUtil {
    _getStatusBubbleState (id: number): IStatusBubbleState {
        return this.entityManager.getComponentDataForEntity(
            ComponentEnum.StatusBubble, id) as IStatusBubbleState;
    }

    addStatusBubble (
        id: number,
        bubbleName: StatusBubble
    ) {
        const statusBubbleState = this._getStatusBubbleState(id);
        if (statusBubbleState.activeBubbles.includes(bubbleName)) {
            return;
        }
        statusBubbleState.activeBubbles.push(bubbleName);
    }
    removeStatusBubble (
        id: number,
        bubbleName: StatusBubble
    ) {
        const statusBubbleState = this._getStatusBubbleState(id);
		const index = statusBubbleState.activeBubbles.indexOf(bubbleName);
		statusBubbleState.activeBubbles.splice(index, 1);
    }
}

export const statusBubbleUtil = new StatusBubbleUtil();