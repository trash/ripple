import {b3} from '../index';
import * as Core from '../Core';

type SimpleTickCallback = (tick: Core.Tick) => void;

export class Simple extends Core.Action {
    callback: SimpleTickCallback;

    constructor (callback: SimpleTickCallback) {
        super();
        this.callback = callback;
    }

    tick (tick: Core.Tick) {
        this.callback(tick);
        return b3.SUCCESS;
    }
}