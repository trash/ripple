import {WaitWander} from '../actions/wait-wander';
// import {AttackAttackerIfAttacked} from '../actions/attack-attacker-if-attacked';
// import {RunFromPredator} from '../actions/run-from-predator';
import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';


export let deerTree = new BehaviorTree();

deerTree.root = new Priority({
	children: [
		// new AttackAttackerIfAttacked(),
		// new RunFromPredator(),
		new WaitWander()
	]
});

deerTree.root.description = 'Deer behavior tree';