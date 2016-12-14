import {WaitWander} from '../actions/wait-wander';
import {PathAroundMap} from '../actions/path-around-map';
import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';
import {Sequence} from '../core/sequence';
import {RandomAction} from '../core/random-action';
import {DoTask} from '../actions/do-task';
import {GetTaskFromProfessions} from '../actions/get-task-from-professions';

export let behaviorTree = new BehaviorTree();

const taskKey = 'task-from-professions';

behaviorTree.root = new Priority({
	children: [
		// Profession stuff
		new Sequence({
			children: [
				new GetTaskFromProfessions(taskKey),
				new DoTask(taskKey)
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