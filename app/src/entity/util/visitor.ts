import {IItemSearchResult} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {IVisitorState} from '../components';
import {itemUtil} from './item';

export class VisitorUtil extends BaseUtil {
    getItemToBuy(visitorId: number): IItemSearchResult {
        const visitorState = this._getVisitorState(visitorId) as IVisitorState;
        const items = itemUtil.getByProperties(visitorState.desiredItems, true);
        return items[0];
    }
}

export const visitorUtil = new VisitorUtil();