import {Sequence} from '../../core/sequence';
import {Tick} from '../../core/tick';
// import {GoToTarget} from '../go-to-target';
// import {GatherResources} from '../gather-resources';
// import {CallMethod} from '../call-method';
// import {BuildBuilding} from '../build-building';
// import {Building} from '../../../core/buildings/building';
import {Task} from '../../../tasks/task';
import {ResourceRequirements} from '../../../resource-requirements';
import {MapTile} from '../../../map/tile';
import {IHealthState} from '../../../entity/components/health';

export class BuilderTask extends Sequence {
	constructor (
		buildingHealthState: IHealthState,
		requiredResources: ResourceRequirements,
		entranceTile: MapTile,
		task: Task
	) {
		super({
			children: [
				// new GatherResources(requiredResources, () => entranceTile),
				// new GoToTarget(() => entranceTile),
				// new BuildBuilding(buildingHealthState, task),
			]
		});
	}
};