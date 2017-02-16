import * as Core from '../Core';
import * as Action from './index';
import {baseUtil} from '../../entity/util';

const key = 'exit-tile';

export class GoToExitMap extends Core.Sequence {
	constructor (description?: string) {
		super({
			children: [
				new Action.GetExitTile(key),
				new Action.GoToTarget(key),
				new Action.Simple(tick => baseUtil.destroyEntity(tick.target.id))
			]
		});
		this.description = description || 'Leaving the area.';
	}
}