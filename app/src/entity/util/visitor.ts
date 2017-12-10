import * as _ from 'lodash';
import {IItemSearchResult} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {IVisitorState} from '../components';
import {itemUtil} from './item';
import {Item} from '../../data/Item';
import {Agent} from '../../data/Agent';

export class VisitorUtil extends BaseUtil {
    getAllVisitors(): number[] {
        return this.entityManager.getEntityIdsForComponent(Component.Visitor);
    }

    spawnVisitor(agentType: Agent): number {
        return this.entityManager.spawner.spawnAgent(agentType, this.entityManager.turn);
    }

    getItemToBuy(visitorId: number): IItemSearchResult {
        const visitorState = this._getVisitorState(visitorId);
        const inventoryState = this._getInventoryState(visitorId);
        const items = itemUtil
            .getByProperties(visitorState.desiredItems, true)
            .filter(item => itemUtil.itemAvailableForSaleFilter(item))
            .filter(item =>
                item.state.value <= inventoryState.gold
            );
        return items[0];
    }

    recruit(id: number) {
        console.log(`recruit visitor with id ${id}`);

        const positionState = _.clone(this._getPositionState(id));
        const visitorState = this._getVisitorState(id);
        // Get rid of recruitment items
        const items = itemUtil.getAllItemsForResourceRequirements(
            positionState.tile,
            visitorState.recruitState
        );
        items.forEach(item => this.entityManager.destroyEntity(item));

        // Replace visitor agent with villager
        this.entityManager.destroyEntity(id);
        this.entityManager.spawner.spawnAgent(
            Agent.Villager,
            this.entityManager.turn,
            {
                position: positionState
            }
        );
    }
}

export const visitorUtil = new VisitorUtil();