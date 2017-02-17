import * as _ from 'lodash';
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {storageUtil} from '../util';
import {
    IInventoryState,
} from '../components';

export class StorageSystem extends EntitySystem {
    destroyComponent(id: number) {
        // Make sure to destroy all the items in the inventory
        storageUtil.getItems(id).forEach(item =>
            this.manager.destroyEntity(item));
    }
}