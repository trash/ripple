import * as Core from '../Core';
import * as Action from './index';
import {baseUtil} from '../../entity/util';

const key = 'exit-tile';

export const GoToExitMap = () => new Core.Sequence({
	children: [
		new Action.GetExitTile(key),
		new Action.GoToTarget(key, 0),
		new Action.Simple(tick => {
			baseUtil.destroyEntity(tick.target.id);
		})
	]
});