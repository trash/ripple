import * as Core from '../Core';
import * as Actions from '../actions';

export let behaviorTree = new Core.BehaviorTree();

behaviorTree.root = new Core.Priority({
	children: [
		// new Acitons.AttackAttackerIfAttacked(),
		// new Acitons.RunFromPredator(),
		// new Acitons.WaitWander(),
		new Actions.PathAroundMap(),
	]
});

behaviorTree.root.description = 'Deer behavior tree';