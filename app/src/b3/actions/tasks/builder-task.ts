import {Sequence} from '../../core/sequence';
import {Tick} from '../../core/tick';
import {GoToTarget} from '../go-to-target';
import {GatherResources} from '../gather-resources';
import {BuildBuilding} from '../build-building';
import {Task} from '../../../tasks/task';
import {ResourceRequirements} from '../../../resource-requirements';
import {IHealthState} from '../../../entity/components/health';
import {IRowColumnCoordinates} from '../../../interfaces';

export class BuilderTask extends Sequence {
	constructor (
		buildingHealthState: IHealthState,
		requiredResources: ResourceRequirements,
		entranceTile: IRowColumnCoordinates,
		task: Task
	) {
		super({
			children: [
				new GatherResources(requiredResources, () => {
					return {
						id: 666,
						tile: entranceTile
					};
				}),
				new GoToTarget(() => {
					return {
						id: 666,
						tile: entranceTile
					};
				}),
				new BuildBuilding(buildingHealthState, task),
			]
		});
	}
}