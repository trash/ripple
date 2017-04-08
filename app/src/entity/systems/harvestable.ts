import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';

import {Component} from '../ComponentEnum';
import {IHealthState} from '../components';
import {IItemState} from '../components';
import {IHarvestableState} from '../components';
import {IPositionState} from '../components';

import {util} from '../../util';
import {constants} from '../../data/constants';
import {events} from '../../events';
// import {itemManager} from '../../services/item-manager';

export class HarvestableSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const healthState = this.manager.getComponentDataForEntity(
                Component.Health, id) as IHealthState;
            const harvestableState = this.manager.getComponentDataForEntity(
                Component.Harvestable, id) as IHarvestableState;
            const positionState = this.manager.getComponentDataForEntity(
                Component.Position, id) as IPositionState;

            if (healthState.currentHealth <= 0) {
                this.manager.spawner.spawnItemsFromList(harvestableState.drops, {
                    position: {
                        tile: positionState.tile
                    },
                    item: {
                        claimed: true
                    }
                });
                events.emit(['trigger-sound', 'harvestResource']);
                if (harvestableState.harvestCompleteSound) {
                    events.emit(['trigger-sound', harvestableState.harvestCompleteSound]);
                }

                this.manager.destroyEntity(id);
            }
        });
    }
}