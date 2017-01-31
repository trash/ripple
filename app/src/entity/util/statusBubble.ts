import {StatusBubble} from '../../data/statusBubble';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {IStatusBubbleState} from '../components';

export class StatusBubbleUtil extends BaseUtil {
    _getStatusBubbleState (id: number): IStatusBubbleState {
        return this.entityManager.getComponentDataForEntity(
            Component.StatusBubble, id) as IStatusBubbleState;
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