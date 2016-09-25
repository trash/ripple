import _ = require('lodash');
import {EntitySystem, EntityManager} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IHealthState} from '../components/health';
import {IItemState} from '../components/item';
import {IHarvestableState} from '../components/harvestable';
import {IPositionState} from '../components/position';
import {util} from '../../util';
import {constants} from '../../data/constants';
import {events} from '../../events';
// import {itemManager} from '../../services/item-manager';

export class HarvestableSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const healthState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Health, id) as IHealthState,
                harvestableState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Harvestable, id) as IHarvestableState,
                positionState = this.manager.getComponentDataForEntity(
                    ComponentEnum.Position, id) as IPositionState;

            if (healthState.currentHealth <= 0) {
                console.info('should be spawning items dropped by harvestable');
                events.emit(['trigger-sound', 'harvestResource']);
                console.error('Reimplement itemManager functionality.');
                // itemManager.spawnFromList(harvestableState.drops, positionState.tile, {
                //     claimed: true
                // }).forEach(entityId => {
                //     const itemState = this.manager.getComponentDataForEntity(
                //         ComponentEnum.Item, entityId) as IItemState;
                //     const itemName = itemState.name;

                //     events.emit(['stats', 'harvest-' + itemName]);
                // });
                console.log('removing entity', id);
                this.manager.removeEntity(id);
            }
        });
    }
}