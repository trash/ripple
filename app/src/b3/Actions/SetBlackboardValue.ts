import {b3} from '../index';
import * as Core from '../Core';
import {util} from '../../util';

type GetValueFunction = (tick: Core.Tick) => any;

export class SetBlackboardValue extends Core.BaseNode {
	blackboardKey: string;
	getValueFunc: GetValueFunction;

	constructor (blackboardKey: string, getValueFunc: GetValueFunction) {
		super();
		this.blackboardKey = blackboardKey;
		this.getValueFunc = getValueFunc;
	}
	tick (tick: Core.Tick) {
		util.blackboardSet(tick, this.blackboardKey, this.getValueFunc(tick));
		return b3.SUCCESS;
	};
}