import * as Core from '../Core';
import * as Actions from '../Actions';
import {AgentTrait} from '../../data/AgentTrait';

export const behaviorTree = new Core.BehaviorTree();

const targetKey = 'agent-to-attack';
const targetTileKey = 'agent-to-attack-tile';
const buildingKey = 'zombie-attack-building';

behaviorTree.root = new Core.Priority({
	children: [
		new Core.Sequence({
			children: [
				new Actions.BlackboardValueExists(targetKey),
				new Actions.GoToAttackTarget(targetKey, targetTileKey),
				new Actions.ClearBlackboardValue(targetKey)
			]
		}),
		new Core.Sequence({
			children: [
				new Core.Priority({
					children: [
						new Actions.CheckForNearbyAgent({
							traits: [AgentTrait.Human]
						}, targetKey, targetTileKey, 20),
						// new Actions.CheckForNearbyFriendlyBuilding(buildingKey)
					]
				}),
				// new Actions.TargetBuildingIfTargetAgentIsInBuilding(targetKey),
				// new Actions.TargetWallIfTargetAgentIsBehindWall(targetKey, 20),
				new Actions.GoToAttackTarget(targetKey, targetTileKey)
			]
		}),
		new Actions.WaitWander(20)
	]
});