import {StatusBubble} from '../../data/status-bubble';
import {b3} from '../';
import * as Core from '../core';
import {statusBubbleUtil} from '../../entity/util/status-bubble';

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