import {WaitWander} from '../actions/wait-wander';
import {PathAroundMap} from '../actions/path-around-map';
import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';
import {Sequence} from '../core/sequence';
import {RandomAction} from '../core/random-action';
import {DoCurrentTask} from '../actions/do-current-task';
import {WasRecentlyAttacked} from '../actions/was-recently-attacked';
import {FleeFromTarget} from '../actions/flee-from-target';

export let behaviorTree = new BehaviorTree();

const wasRecentlyAttackedKey = 'was-recently-attacked';

behaviorTree.root = new Priority({
	children: [
		new Sequence({
			children: [
				new WasRecentlyAttacked(wasRecentlyAttackedKey, 3),
				new FleeFromTarget(wasRecentlyAttackedKey)
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