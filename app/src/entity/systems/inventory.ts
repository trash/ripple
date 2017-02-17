import * as _ from 'lodash';
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {inventoryUtil} from '../util';
import {
    IInventoryState,
} from '../components';

export class InventorySystem extends EntitySystem {
    destroyComponent(id: number) {
        // Make sure to destroy all the items in the inventory
        inventoryUtil.getItems(id).forEach(item =>
            this.manager.destroyEntity(item));
    }
}