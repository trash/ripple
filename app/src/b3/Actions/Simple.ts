import {b3, StatusCode} from '../index';
import * as Core from '../Core';

export type SimpleTickCallback = (tick: Core.Tick) => void;

export class Simple extends Core.Action {
    callback: SimpleTickCallback;
    status: StatusCode;

    constructor (
        callback: SimpleTickCallback,
        status: StatusCode = b3.SUCCESS
    ) {
        super();
        this.status = status;
        this.callback = callback;
    }

    tick (tick: Core.Tick) {
        this.callback(tick);
        return this.status;
    }
}