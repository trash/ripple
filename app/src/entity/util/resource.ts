import {BaseUtil} from './base';
import {Direction, IRowColumnCoordinates} from '../../interfaces';

export class ResourceUtil extends BaseUtil {
    harvest (
        resource: number,
        contribution: number
    ): boolean {
        const healthState = this._getHealthState(resource);

        healthState.currentHealth -= contribution;
        // this.resource.harvest(contribution);

        if (healthState.currentHealth <= 0) {
            return true;
        }
        return false;
    }
}

export const resourceUtil = new ResourceUtil();