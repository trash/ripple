import {buildingUtil} from '../../entity/util';
import {util} from '../../util';
import {constants} from '../../data/constants';
import {StatusBubble} from '../../data/StatusBubble';
import {Profession} from '../../data/Profession';
import {Building} from '../../data/Building';
import {villagerUtil} from '../../entity/util/villager';
import {agentUtil} from '../../entity/util/agent';
import {positionUtil} from '../../entity/util/position';

import * as Core from '../Core';
import * as Actions from '../Actions';

export const behaviorTree = new Core.BehaviorTree();

const wasRecentlyAttackedKey = 'was-recently-attacked';
const wasRecentlyAttackedTileKey = 'was-recently-attacked-tile';
const fleeBuildingKey = 'flee-building';
const findHomeKey = 'find-home';
const findBetterArmorKey = 'find-better-armor';

let findBetterArmorId: number = null;

behaviorTree.root = new Core.Priority({
	children: [
		new Actions.ContinueSleeping(),
		// Make them flee if they've been attacked recently
		new Core.Sequence({
			children: [
				// Guards shouldn't flee
				new Actions.IsTrue(tick => !villagerUtil.hasProfession(
					tick.target.villager, Profession.Guard)
				),
				// This isn't very smart, they should probably check if the enemy
				// is still around or in range
				new Actions.WasRecentlyAttacked(
					wasRecentlyAttackedKey,
					wasRecentlyAttackedTileKey,
					100
				),
				new Core.Priority({
					children: [
						new Core.Sequence({
							children: [
								new Actions.BuildingWithSpaceIsNearby(
									null, // any building
									fleeBuildingKey,
									tick => tick.target.position.tile
								),
								new Actions.GoToTarget((tick: Core.Tick) =>
									buildingUtil.getTileFromBuilding(util.blackboardGet(tick, fleeBuildingKey))
								),
								new Actions.EnterBuilding(fleeBuildingKey)
							]
						}),
						new Actions.FleeFromTarget(wasRecentlyAttackedKey)
					]
				})
			]
		}),
		// Check if they need to sleep
		new Core.Sequence({
			children: [
				new Actions.IsTrue(tick => tick.target.sleep.value >= constants.SLEEP.MAX),
				new Actions.ShowBubble(StatusBubble.Sleep),
				new Core.Sequence({
					children: [
						// We need the villagers to move on to sleeping even if they don't have a home
						new Core.FailureBecomesSuccess({
							child: new Core.Sequence({
								children: [
									new Actions.IsTrue(tick => !!tick.target.villager.home),
									new Actions.SetBlackboardValue(
										findHomeKey,
										tick => tick.target.villager.home
									),
									new Actions.GoToTarget((tick: Core.Tick) =>
										buildingUtil.getTileFromBuilding(
											util.blackboardGet(tick, findHomeKey)
										)
									),
									new Actions.EnterBuilding(findHomeKey)
								]
							})
						}),
						new Actions.Sleep()
					]
				})
			]
		}),
		// Super hungry
		new Core.Sequence({
			children: [
				new Actions.IsTrue(tick => tick.target.hunger.value > constants.HUNGER.MAX * 2/3),
				new Actions.FindFoodAndEat()
			]
		}),
		// Equip armor if needed
		new Core.Sequence({
			children: [
				new Actions.IsTrue(tick => tick.target.equipsArmor.armor === null),
				new Actions.IsTrue(tick =>
					!!agentUtil.findBetterArmor(tick.target.id, true)
				),
				new Actions.SetBlackboardValue(findBetterArmorKey, tick => {
					const betterArmor = agentUtil.findBetterArmor(tick.target.id);
					findBetterArmorId = betterArmor.id;
					return betterArmor;
				}),
				new Actions.GoToTarget(() => positionUtil.getTileFromEntityId(findBetterArmorId)),
				new Actions.PickupItem(findBetterArmorKey)
			]
		}),
		// Profession stuff
		new Core.Sequence({
			children: [
				new Actions.DoCurrentTask(),
			]
		}),
		// Idle shizz
		new Core.RandomAction({
			children: [
				new Actions.WaitWander(20),
				new Actions.WaitWander(10),
				// new StareAtRandomObject()
			]
		})
		// Testing
		// new PathAroundMap(),
	]
});
behaviorTree.name = 'villager';
behaviorTree.root.description = 'Deer behavior tree';