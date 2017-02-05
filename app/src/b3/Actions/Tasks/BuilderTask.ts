import * as Core from '../../Core';
import {Task} from '../../../Tasks/task';
import {ResourceRequirements} from '../../../ResourceRequirements';
import {IHealthState} from '../../../entity/components/health';
import {IRowColumnCoordinates} from '../../../interfaces';

import * as Actions from '../index';

export class BuilderTask extends Core.Sequence {
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