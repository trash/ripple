import {CheckForNearbyAgent} from '../actions/check-for-nearby-agent';
// import {CheckForNearbyFriendlyBuilding} from '../actions/check-for-nearby-friendly-building';
// import {TargetWallIfTargetAgentIsBehindWall} from '../actions/target-wall-if-target-agent-is-behind-wall';
// import {TargetBuildingIfTargetAgentIsInBuilding} from '../actions/target-building-if-target-agent-is-in-building';
import {GoToAttackTarget} from '../actions/go-to-attack-target';
import {BlackboardValueExists} from '../actions/blackboard-value-exists';
import {ClearBlackboardValue} from '../actions/clear-blackboard-value';
import {WaitWander} from '../actions/wait-wander';
import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';
import {Sequence} from '../core/sequence';
import {AgentTraits} from '../../interfaces';

export let zombieTree = new BehaviorTree();

const targetKey = 'agent-to-attack';
const targetTileKey = 'agent-to-attack-tile';
const buildingKey = 'zombie-attack-building';

zombieTree.root = new Priority({
	children: [
		new Sequence({
			children: [
				new BlackboardValueExists(targetKey),
				new GoToAttackTarget(targetKey, targetTileKey),
				new ClearBlackboardValue(targetKey)
			]
		}),
		new Sequence({
			children: [
				new Priority({
					children: [
						new CheckForNearbyAgent({
							traits: [AgentTraits.human]
						}, targetKey, targetTileKey, 20),
						// new CheckForNearbyFriendlyBuilding(buildingKey)
					]
				}),
				// new TargetBuildingIfTargetAgentIsInBuilding(targetKey),
				// new TargetWallIfTargetAgentIsBehindWall(targetKey, 20),
				new GoToAttackTarget(targetKey, targetTileKey)
			]
		}),
		new WaitWander(20)
	]
});