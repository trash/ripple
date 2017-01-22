import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';
import {ComponentEnum} from '../componentEnum';

import {IHungerState} from '../components';
import {IHealthState} from '../components';

import {util} from '../../util';
import {constants} from '../../data/constants';

export class HungerSystem extends EntitySystem {
    readonly updateInterval = 10;

    update (entityIds: number[], turn: number, stopped: boolean) {
        // Hunger doesn't get updated when the game is paused
        if (stopped) {
            return;
        }
        entityIds.forEach(id => {
            const hungerState = this.manager.getComponentDataForEntity(
                ComponentEnum.Hunger, id) as IHungerState;

            hungerState.value += this.updateInterval;
            // Check bounds
            hungerState.value = util.bound(hungerState.value, hungerState.min, hungerState.max);

            // They starved
            if (hungerState.value === hungerState.max) {
                const healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState;
                healthState.currentHealth = 0;
            }
        });
    }
}