import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {Tile} from '../../map/tile';
import {Inventory} from '../../agents/inventory';
import {AgentTraits} from '../../interfaces';

export interface IAgentState {
    agentName: string;
    genderEnabled: boolean;
    speed: number;
    strength: number;

    lastTurn?: number;
    gender?: string;
    spriteCount?: number;
    defaultSpriteFrame?: number;
    spriteIndex?: number;
    inventory?: Inventory;
    dead?: boolean;
    traits?: AgentTraits[];
    corpseSprite?: PIXI.Sprite;
}

export interface IAgentComponent extends IComponent {
    state: IAgentState;
}

export let Agent: IAgentComponent = {
    name: 'agent',
    enum: ComponentEnum.Agent,
    state: {
        agentName: 'zombie',
        genderEnabled: false,
        gender: null,
        defaultSpriteFrame: 0,
        spriteCount: null,
        spriteIndex: null,
        lastTurn: 0,
        speed: 15,
        inventory: null,
        dead: false,
        traits: [],
        strength: 1
    }
};