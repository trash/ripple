import {events} from '../../events';
import * as _ from 'lodash';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {IAgentState} from '../../entity/components';

export class EquipsArmorUtil extends BaseUtil {
	toString(entity: number): string {
		const state = this._getEquipsArmorState(entity);
		const itemState = this._getItemState(state.armor);
		const armorState = this._getArmorState(state.armor);
		if (!armorState) {
			return '';
		}
		return `${itemState.readableName} (${armorState.value})`;
	}
}

export const equipsArmorUtil = new EquipsArmorUtil();