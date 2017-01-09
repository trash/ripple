import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';

import {IHungerState} from '../components/hunger';

import {util} from '../../util';
import {constants} from '../../data/constants';

export class HungerSystem extends EntitySystem {
    readonly updateInterval = 10;

    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const hungerState = this.manager.getComponentDataForEntity(
                ComponentEnum.Hunger, id) as IHungerState;

            hungerState.value++;
            // Check bounds
            if (hungerState.value < hungerState.min) {
                console.log('starved m8');
                hungerState.value = hungerState.min;
            } else if (hungerState.value > hungerState.max) {
                hungerState.value = hungerState.max;
            }
        });
    }
}