import {BaseUtil} from './base';
import {IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {ITownState} from '../Components';

export class TownUtil extends BaseUtil {
    addGold(town: number, amount: number) {
        const townState = this._getTownState(town);
        townState.gold += amount;
        console.log(`Town gold: ${townState.gold}`);
    }
}

export const townUtil = new TownUtil();