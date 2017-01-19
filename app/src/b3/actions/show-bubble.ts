import {b3} from '../';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {statusBubbleUtil} from '../../entity/util/status-bubble';

export class ShowBubble extends BaseNode {
    bubbleName: string;

    constructor (bubbleName: string) {
        super();
        this.bubbleName = bubbleName;
    }
    tick (tick: Tick) {
        statusBubbleUtil.addStatusBubble(tick.target.id, this.bubbleName);
        return b3.SUCCESS;
    }
}