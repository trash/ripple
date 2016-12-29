import {WaitWander} from '../actions/wait-wander';
import {PathAroundMap} from '../actions/path-around-map';
import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';
import {Sequence} from '../core/sequence';
import {RandomAction} from '../core/random-action';
import {DoCurrentTask} from '../actions/do-current-task';
import {WasRecentlyAttacked} from '../actions/was-recently-attacked';
import {FleeFromTarget} from '../actions/flee-from-target';
import {GoToTarget} from '../actions/go-to-target';
import {BuildingWithSpaceIsNearby} from '../actions/building-with-space-is-nearby';
import {EnterBuilding} from '../actions/enter-building';
import {buildingUtil} from '../../entity/util/building';
import {util} from '../../util';
import {Tick} from '../core/tick';

export let behaviorTree = new BehaviorTree();

const wasRecentlyAttackedKey = 'was-recently-attacked';
const fleeBuildingKey = 'flee-building';

behaviorTree.root = new Priority({
	children: [
		new Sequence({
			children: [
				new WasRecentlyAttacked(wasRecentlyAttackedKey, 10),
				new Priority({
					children: [
						new Sequence({
							children: [
								new BuildingWithSpaceIsNearby(fleeBuildingKey),
								new GoToTarget((tick: Tick) =>
									buildingUtil.getTileFromBuilding(util.blackboardGet(tick, fleeBuildingKey))),
								new EnterBuilding(fleeBuildingKey)
							]
						}),
						new FleeFromTarget(wasRecentlyAttackedKey)
					]
				})
			]
		}),
		// Profession stuff
		new Sequence({
			children: [
				new DoCurrentTask(),
			]
		}),
		// Idle shizz
		new RandomAction({
			children: [
				new WaitWander(20),
				new WaitWander(10),
				// new StareAtRandomObject()
			]
		})
		// Testing
		// new PathAroundMap(),
	]
});
behaviorTree.name = 'villager';
behaviorTree.root.description = 'Deer behavior tree';