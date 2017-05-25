import {globalRefs} from '../../globalRefs';
import {BaseUtil} from './base';
import {IHealthState} from '../components';

export class HealthUtil extends BaseUtil {
    toString(healthState: IHealthState, deadString?: string): string {
        if (deadString && healthState.currentHealth <= 0) {
            return deadString;
        }
        return `${healthState.currentHealth}/${healthState.maxHealth}`;
    }
}

export const healthUtil = new HealthUtil();