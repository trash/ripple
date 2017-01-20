import {StatusBubble} from '../../data/status-bubble';
import {b3} from '../';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {statusBubbleUtil} from '../../entity/util/status-bubble';

export class HideBubble extends BaseNode {
    bubbleName: StatusBubble;

    constructor (bubbleName: StatusBubble) {
        super();
        this.bubbleName = bubbleName;
    }
    tick (tick: Tick) {
        statusBubbleUtil.removeStatusBubble(tick.target.id, this.bubbleName);
        return b3.SUCCESS;
    }
}