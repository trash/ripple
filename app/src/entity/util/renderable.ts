import {globalRefs} from '../../globalRefs';
import {BaseUtil} from './base';
import {IRenderableState} from '../components';

export class RenderableUtil extends BaseUtil {
    setShown(state: IRenderableState, shown: boolean): void {
        state.shown = shown;
        state.dirty = true;
    }
}

export const renderableUtil = new RenderableUtil();