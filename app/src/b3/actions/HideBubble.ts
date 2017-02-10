import {StatusBubble} from '../../data/StatusBubble';
import {b3} from '../';
import * as Core from '../Core';
import {statusBubbleUtil} from '../../entity/util';

export class HideBubble extends Core.BaseNode {
    bubbleName: StatusBubble;

    constructor (bubbleName: StatusBubble) {
        super();
        this.bubbleName = bubbleName;
    }
    tick (tick: Core.Tick) {
        statusBubbleUtil.removeStatusBubble(tick.target.id, this.bubbleName);
        return b3.SUCCESS;
    }
}