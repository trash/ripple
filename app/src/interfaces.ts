import {Tile} from './map/tile';
import {professions} from './data/professions';

export interface IAgentSprite extends PIXI.Sprite {
	frame?: number;
}

export interface IItemSearchResult {
	id: number;
	state: IItemState;
}

export interface IRowColumnCoordinates {
	row: number;
	column: number;
};

export interface ICoordinates {
	x: number;
	y: number;
};

export interface IRequiredResources {
    [key: string]: number;
}

export interface IRequiredResourcesInput {
	[index: string]: number;
}

export interface IResourceRequirementsMapEntry {
	gathered: number;
	required: number;
};

export interface IResourceRequirementsMap {
	[index: string]: IResourceRequirementsMapEntry;
}

export enum AgentTraits {
	monster,
	prey,
	predator,
	thief,
	human
};

export enum ItemProperties {
	resource,
	wood,
	food,
	farmable,
	potion,
	armor,
	weapon,
	copper,
	sword,
	iron,
	gold
};

export interface IItemDefinition {
	name: string;
	readableName: string;
	description: string;
	spriteName: string;

	properties?: ItemProperties[];
	value?: number;
	requiredResources?: IRequiredResourcesInput;
	taskQueue?: string;
	craftProfession?: professions;
	craftTurns?: number;
	healAmount?: number;
}

export interface IWeaponDefinition extends IItemDefinition {
	damage: number;
}

export interface IArmorDefinition extends IItemDefinition {
	armor: number;
}

export interface ISoundDataEntry {
	list: string[];
	throttle?: number;
	muteOnGameStart?: boolean;
}

export interface ISoundDataList {
	[index: string]: ISoundDataEntry
}

export interface IShopOptions {
	itemTypes: ItemProperties[];
	storageSpace: number;
};

export interface IStorageOptions {
	amount: number;
	restrictions?: ItemProperties[];
}

export interface INearestTile {
	tile: Tile,
	distance: number
};

export interface IDimensions {
	width: number;
	height: number;
	base?: ICoordinates;
}

export interface ICameraView {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface IPosition {
	left?: number;
	right?: number;
	top?: number;
	bottom?: number;
}

export interface INamesDefinition {
	surnamePrefix: string[];
	surnameSuffix: string[];
	surname?: string[];
	firstName: string[] | {
		male: string[],
		female: string[]
	};
}

export interface IBuildingNamesDefinition {
	adjectives: string[];
	nouns: string[];
}

export type NDArray<T> = (data: T[], options: [number, number]) => NDArray<T>;

export type NDArrayData = {
	data: number[][];
}

export type Direction = 'left' | 'right' | 'up' | 'down';


import {IPositionState} from './entity/components/position';
import {IResourceState} from './entity/components/resource';
import {IHarvestableState} from './entity/components/harvestable';
import {IHealthState} from './entity/components/health';
import {IHealthBarState} from './entity/components/health-bar';
import {IItemState} from './entity/components/item';
import {IAgentState} from './entity/components/agent';
import {IBehaviorTreeState} from './entity/components/behavior-tree';
import {IBuildingState} from './entity/components/building';
import {IConstructibleState} from './entity/components/constructible';
import {ICollisionState} from './entity/components/collision';
import {ICorpseState} from './entity/components/corpse';

export interface IEntityComponentData {
	position?: IPositionState;
	corpse?: ICorpseState;
	resource?: IResourceState;
	harvestable?: IHarvestableState;
	health?: IHealthState;
	item?: IItemState;
	agent?: IAgentState;
	behaviorTree?: IBehaviorTreeState;
	building?: IBuildingState;
	constructible?: IConstructibleState;
	healthBar?: IHealthBarState;
	collision?: ICollisionState;
}

export interface IAssemblageDataMap {
    [key: string]: IEntityComponentData;
}