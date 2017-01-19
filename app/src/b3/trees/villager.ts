import {buildingUtil} from '../../entity/util/building';
import {util} from '../../util';
import {Tick} from '../core/tick';
import {constants} from '../../data/constants';

import {BehaviorTree} from '../core/behavior-tree';
import {Priority} from '../core/priority';
import {Sequence} from '../core/sequence';
import {RandomAction} from '../core/random-action';
import {FailureBecomesSuccess} from '../core/failure-becomes-success';

import {WaitWander} from '../actions/wait-wander';
import {PathAroundMap} from '../actions/path-around-map';
import {DoCurrentTask} from '../actions/do-current-task';
import {WasRecentlyAttacked} from '../actions/was-recently-attacked';
import {FleeFromTarget} from '../actions/flee-from-target';
import {GoToTarget} from '../actions/go-to-target';
import {BuildingWithSpaceIsNearby} from '../actions/building-with-space-is-nearby';
import {EnterBuilding} from '../actions/enter-building';
import {ContinueSleeping} from '../actions/continue-sleeping';
import {Sleep} from '../actions/sleep';
import {IsTrue} from '../actions/is-true';
import {SetBlackboardValue} from '../actions/set-blackboard-value';
import {FindFoodAndEat} from '../actions/find-food-and-eat';
import {ShowBubble} from '../actions/show-bubble';

export let behaviorTree = new BehaviorTree();

const wasRecentlyAttackedKey = 'was-recently-attacked';
const fleeBuildingKey = 'flee-building';
const findHomeKey = 'find-home';

behaviorTree.root = new Priority({
	children: [
		new ContinueSleeping(),
		// Make them flee if they've been attacked recently
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
		// Check if they need to sleep
		new Sequence({
			children: [
				new IsTrue(tick => tick.target.sleep.value >= constants.SLEEP.MAX),
				new ShowBubble('sleep'),
				new Sequence({
					children: [
						// We need the villagers to move on to sleeping even if they don't have a home
						new FailureBecomesSuccess({
							child: new Sequence({
								children: [
									new IsTrue(tick => !!tick.target.villager.home),
									new SetBlackboardValue(findHomeKey,
										tick => tick.target.villager.home),
									new GoToTarget((tick: Tick) =>
										buildingUtil.getTileFromBuilding(util.blackboardGet(tick, findHomeKey))),
									new EnterBuilding(findHomeKey)
								]
							})
						}),
						new Sleep()
					]
				})
			]
		}),
		// Super hungry
		new Sequence({
			children: [
				new IsTrue(tick => tick.target.hunger.value > constants.HUNGER.MAX * 2/3),
				new FindFoodAndEat()
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