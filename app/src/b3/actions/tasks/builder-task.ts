import {Sequence} from '../../core/sequence';
import {Tick} from '../../core/tick';
import {Task} from '../../../tasks/task';
import {ResourceRequirements} from '../../../resource-requirements';
import {IHealthState} from '../../../entity/components/health';
import {IRowColumnCoordinates} from '../../../interfaces';

import * as Actions from '../index';

export class BuilderTask extends Sequence {
	constructor (
		buildingHealthState: IHealthState,
		requiredResources: ResourceRequirements,
		entranceTile: IRowColumnCoordinates,
		task: Task
	) {
		super({
			children: [
				new Actions.GatherResources(requiredResources, () => entranceTile),
				new Actions.GoToTarget(() => entranceTile),
				new Actions.BuildBuilding(buildingHealthState, task),
			]
		});
	}
}