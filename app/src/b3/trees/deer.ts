import {WaitWander} from '../actions/wait-wander';
import {PathAroundMap} from '../actions/path-around-map';
// import {AttackAttackerIfAttacked} from '../actions/attack-attacker-if-attacked';
// import {RunFromPredator} from '../actions/run-from-predator';
import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';

export let behaviorTree = new BehaviorTree();

behaviorTree.root = new Priority({
	children: [
		// new AttackAttackerIfAttacked(),
		// new RunFromPredator(),
		// new WaitWander(),
		new PathAroundMap(),
	]
});

behaviorTree.root.description = 'Deer behavior tree';