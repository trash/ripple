import {IStatusBubbleState} from '../components/status-bubble';

export class StatusBubbleUtil {
    addStatusBubble (statusBubbleState, bubbleName) {
        statusBubbleState.activeBubbles.push(bubbleName);
    }
    removeStatusBubble (statusBubbleState: IStatusBubbleState, bubbleName: string) {
		const index = statusBubbleState.activeBubbles.indexOf(bubbleName);
		statusBubbleState.activeBubbles.splice(index, 1);
    }
}

export const statusBubbleUtil = new StatusBubbleUtil();