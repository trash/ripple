import {events} from '../../events';
import {BaseUtil} from './base';
import {Direction, IRowColumnCoordinates} from '../../interfaces';

export class HarvestableUtil extends BaseUtil {
    harvest (
        resource: number,
        contribution: number
    ): boolean {
        const healthState = this._getHealthState(resource);

        if (!healthState) {
            console.error('Trying to harvest entity that is already destroyed');
            return true;
        }

        healthState.currentHealth -= contribution;
        // this.resource.harvest(contribution);

        const harvestableState = this._getHarvestableState(resource);
        if (harvestableState.harvestSound) {
            events.emit(['trigger-sound', harvestableState.harvestSound]);
        }

        if (healthState.currentHealth <= 0) {
            return true;
        }
        return false;
    }
}

export const harvestableUtil = new HarvestableUtil();