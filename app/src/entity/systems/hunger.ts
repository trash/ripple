import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

import {IHungerState} from '../components/hunger';
import {IHealthState} from '../components/health';

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
            if (hungerState.value < hungerState.min) {
                hungerState.value = hungerState.min;
            } else if (hungerState.value > hungerState.max) {
                hungerState.value = hungerState.max;
            }

            if (hungerState.value === hungerState.max) {
                const healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState;
                healthState.currentHealth = 0;
            }
        });
    }
}