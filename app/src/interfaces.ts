import * as Immutable from 'immutable';
import {MapTile} from './map/tile';
import {Profession} from './data/Profession';
import {Item} from './data/Item';
import {ItemProperty} from './data/ItemProperty';
import {AgentTrait} from './data/AgentTrait';
import {Tick} from './b3/Core';
import {EntitySpawner} from './entity/entitySpawner';
import {GameClock} from './game/GameClock';

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

export interface LayerData {
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

export interface TilemapData {
	version: number;
	width: number;
	height: number;
	tilewidth: number;
	tileheight: number;
	tilesets: ITileset[];
	layers: LayerData[];
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

export interface XYCoordinates {
	x: number;
	y: number;
};

export type ItemCountMap = {
	[index: number]: number;
}

export type ItemCountEntry = {
	enum: Item;
	count: number;
}
export type RequiredItems = ItemCountEntry[];

export interface IItemRequirementsMapEntry {
	gathered: number;
	required: number;
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
	base?: XYCoordinates;
}

export interface CameraView {
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
	IVisitorState,
	IEquipsArmorState,
	IShopState,
	IArmorState,
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
	visitor?: IVisitorState;
	villager?: IVillagerState;
	inventory?: IInventoryState;
	shop?: IShopState;
	armor?: IArmorState;
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
	visitor?: IVisitorState;
	equipsArmor?: IEquipsArmorState;
	clock: GameClock;
}

export interface IAgentSearchOptions {
	cannotHaveId?: number;
	traits?: AgentTrait[];
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
	toBeStored?: boolean;
	ignoredIds?: number[];
	forSale?: boolean;
	stored?: boolean;
}

export type AgentListEntry = {
    id: number;
    agent: IAgentState;
	name: INameState;
	villager: IVillagerState;
	visitor: IVisitorState;
	position: IPositionState;
	inventory: IInventoryState;
	health: IHealthState;
	equipsArmor: IEquipsArmorState;
	lastAction: string;
}

export type BuildingListEntry = {
	id: number;
	building: IBuildingState;
	constructible: IConstructibleState;
	health: IHealthState;
	position: IPositionState;
	storage: IStorageState;
	shop: IShopState;
}

export type ResourceListEntry = {
	id: number;
	resource: IResourceState;
	harvestable: IHarvestableState;
	health: IHealthState;
	position: IPositionState;
}

export type CraftableItemEntry = {
    queued: number;
}

export type CraftableItemMap = Immutable.Map<Item, CraftableItemEntry>;

export type ShopItemEntry = {
	toBeSold: number;
}

export type ShopItemMap = Immutable.Map<Item, ShopItemEntry>;