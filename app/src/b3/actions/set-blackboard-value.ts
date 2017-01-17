import {b3} from '../index';
import {BaseNode} from '../core/base-node';
import {Tick} from '../core/tick';
import {util} from '../../util';

type GetValueFunction = (tick: Tick) => any;

export class SetBlackboardValue extends BaseNode {
	blackboardKey: string;
	getValueFunc: GetValueFunction;

	constructor (blackboardKey: string, getValueFunc: GetValueFunction) {
		super();
		this.blackboardKey = blackboardKey;
		this.getValueFunc = getValueFunc;
	}
	tick (tick: Tick) {
		util.blackboardSet(tick, this.blackboardKey, this.getValueFunc(tick));
		return b3.SUCCESS;
	};
}