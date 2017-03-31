import {globalRefs} from '../../globalRefs';
import {BaseUtil} from './base';
import {IHealthState} from '../components';

export class HealthUtil extends BaseUtil {
    toString(healthState: IHealthState): string {
        return `${healthState.currentHealth}/${healthState.maxHealth}`;
    }
}

export const healthUtil = new HealthUtil();