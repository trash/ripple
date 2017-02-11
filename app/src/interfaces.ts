import {MapTile} from './map/tile';
import {Profession} from './data/Profession';
import {Item} from './data/Item';
import {Tick} from './b3/Core';
import {EntitySpawner} from './entity/entitySpawner';

export interface ITileset {
	name: string;
	firstgid: number;
	imageheight: number;
	imagewidth: number;
	tilewidth: number;
	tileheight: number;
	margin: number;
	spacing: number;
	properties: any;
	image: string;
}

export interface ILayerData {
	name: string;
	data: string[];
	width: number;
	height: number;
	opacity: number;
	type: string;
	visible: boolean;
	x: number;
	y: number;
}

export interface ITilemapData {
	version: number;
	width: number;
	height: number;
	tilewidth: number;
	tileheight: number;
	tilesets: ITileset[];
	layers: ILayerData[];
	orientation: string;
	properties: any;
}

export interface IRandomTileOptions {
	accessible?: boolean;
	range?: number;
	baseTile?: IRowColumnCoordinates;
}

export interface IAgentSprite extends PIXI.Sprite {
	frame?: number;
}

export interface IItemSearchResult {
	id: number;
	state: IItemState;
	position: IPositionState;
}

export interface IRowColumnCoordinates {
	row: number;
	column: number;
};

export interface IRowColumnCoordinateWrapper<T> extends IRowColumnCoordinates {
	value: T;
	index: number;
}

export interface ICoordinates {
	x: number;
	y: number;
};

export type RequiredResourceEntry = {
	enum: Item;
	count: number;
}
export type RequiredResources = RequiredResourceEntry[];

export interface IResourceRequirementsMapEntry {
	gathered: number;
	required: number;
}

export enum AgentTraits {
	Monster,
	Prey,
	Predator,
	Thief,
	Human
};

export enum ItemProperty {
	Resource,
	Wood,
	Food,
	Farmable,
	Potion,
	Armor,
	Weapon,
	Copper,
	Sword,
	Iron,
	Gold
};

export interface ISoundDataEntry {
	list: string[];
	throttle?: number;
	muteOnGameStart?: boolean;
}

export interface ISoundDataList {
	[index: string]: ISoundDataEntry
}

export interface IShopOptions {
	itemTypes: ItemProperty[];
	storageSpace: number;
};

export interface IStorageOptions {
	amount: number;
	restrictions?: ItemProperty[];
}

export interface INearestTile {
	tile: MapTile,
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

export interface NDArray<T> {
	data: T[];
	shape: [number, number];
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

export type Direction = 'left' | 'right' | 'up' | 'down';

import {
	IPositionState,
	IResourceState,
	IHarvestableState,
	IHealthState,
	IHealthBarState,
	IItemState,
	IAgentState,
	INameState,
	IBehaviorTreeState,
	IBuildingState,
	IConstructibleState,
	ICollisionState,
	ICorpseState,
	IVillagerState,
	IStatusBubbleState,
	IInventoryState,
	ISleepState,
	IHungerState,
	ICraftableState,
	IStorageState,
} from './entity/components';

export interface IEntityComponentData {
	position?: IPositionState;
	corpse?: ICorpseState;
	resource?: IResourceState;
	harvestable?: IHarvestableState;
	health?: IHealthState;
	item?: IItemState;
	agent?: IAgentState;
	name?: INameState;
	hunger?: IHungerState;
	behaviorTree?: IBehaviorTreeState;
	building?: IBuildingState;
	constructible?: IConstructibleState;
	healthBar?: IHealthBarState;
	collision?: ICollisionState;
	craftable?: ICraftableState;
	storage?: IStorageState;
}

export interface IAssemblageDataMap {
    [key: number]: IEntityComponentData;
}

export type Gender = 'male' | 'female';

export interface ItemSearchResult {
	id: number;
	item: IItemState;
}

export interface AgentSearchResult {
	id: number;
	agent: IAgentState;
	position: IPositionState;
}

export type dropOffTargetKeyOrFunctionType = string | ((tick: Tick) => IRowColumnCoordinates);

import {GameMap} from './map';

export interface IBehaviorTreeTickTarget {
    id: number;
    behaviorTree: IBehaviorTreeState;
    position: IPositionState;
    villager: IVillagerState;
    health: IHealthState;
    agent: IAgentState;
    name: INameState;
    sleep: ISleepState;
    hunger: IHungerState;
    statusBubble: IStatusBubbleState;
    turn: number;
    map: GameMap;
    inventory: IInventoryState;
	entitySpawner: EntitySpawner;
}

export interface IAgentSearchOptions {
	cannotHaveId?: number;
	traits?: AgentTraits[];
}

export interface BuildingInfo {
	name: string;
}

export interface ItemSearchOptions {
	itemNames?: string | string[];
	itemEnums?: Item[];
	properties?: ItemProperty[];
	claimed?: boolean;
	sortBy?: string;
}