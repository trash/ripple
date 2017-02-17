import {BaseUtil} from './base';
import {IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {ITownState} from '../Components';
import {constants} from '../../data/constants';
import {store} from '../../redux/store';
import {updateTownGold} from '../../redux/actions';

export class TownUtil extends BaseUtil {
    private getTownState(): ITownState {
        return this._getTownState(constants.TOWN_ID);
    }
    addGold(amount: number) {
        const townState = this.getTownState();
        townState.gold += amount;
        store.dispatch(updateTownGold(townState.gold));
    }

    getGold(): number {
        return this.getTownState().gold;
    }
}

export const townUtil = new TownUtil();