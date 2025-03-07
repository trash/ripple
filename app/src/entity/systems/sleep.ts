import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';

import {ISleepState} from '../components';
import {IVillagerState} from '../components';

import {statusBubbleUtil} from '../util';

import {util} from '../../util';
import {constants} from '../../data/constants';
import {StatusBubble} from '../../data/StatusBubble';

export class SleepSystem extends EntitySystem {
    readonly updateInterval = 10;

    update (entityIds: number[], turn: number, stopped: boolean) {
        // Sleep doesn't get updated when the game is paused
        if (stopped) {
            return;
        }
        entityIds.forEach(id => {
            const sleepState = this.manager.getComponentDataForEntity(
                Component.Sleep, id) as ISleepState;

            if (sleepState.isSleeping) {
                let sleepValue = constants.SLEEP.RECOVER_TICK;
                // If they're sleeping on the floor then they have to sleep for twice as long
                if (!sleepState.inHome) {
                    console.info('not in home');
                    sleepValue = ((sleepValue - 1) / 2) + 1;
                }
                sleepState.value -= sleepValue * this.updateInterval;
            } else {
                sleepState.value += this.updateInterval;
            }

            // They're done sleeping
            if (sleepState.value <= sleepState.min) {
                sleepState.isSleeping = false;
                sleepState.inHome = false;
                statusBubbleUtil.removeStatusBubble(id, StatusBubble.Sleep);
            }

            sleepState.value = util.bound(sleepState.value, sleepState.min, sleepState.max);
        });
    }
}