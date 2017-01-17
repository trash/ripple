import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

import {ISleepState} from '../components/sleep';
import {IVillagerState} from '../components/villager';

import {util} from '../../util';
import {constants} from '../../data/constants';

export class SleepSystem extends EntitySystem {
    readonly updateInterval = 10;

    update (entityIds: number[], turn: number, stopped: boolean) {
        // Sleep doesn't get updated when the game is paused
        if (stopped) {
            return;
        }
        entityIds.forEach(id => {
            const sleepState = this.manager.getComponentDataForEntity(
                ComponentEnum.Sleep, id) as ISleepState;

            if (sleepState.isSleeping) {
                let sleepValue = constants.SLEEP.RECOVER_TICK;
                // If they're sleeping on the floor then they have to sleep for twice as long
                if (!sleepState.inHome) {
                    sleepValue = ((sleepValue - 1) / 2) + 1;
                }
                sleepState.value -= sleepValue * this.updateInterval;
            } else {
                sleepState.value += this.updateInterval;
                // Check bounds
                sleepState.value = util.bound(sleepState.value, sleepState.min, sleepState.max);

                // Make them sleep
                if (sleepState.value === sleepState.max) {
                    sleepState.isSleeping = true;
                }
            }

            // They're done sleeping
            if (sleepState.value <= 0) {
                sleepState.isSleeping = false;
            }

            sleepState.value = util.bound(sleepState.value, sleepState.min, sleepState.max);
        });
    }
}