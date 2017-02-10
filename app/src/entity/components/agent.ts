import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {AgentTraits, Gender} from '../../interfaces';
import {Agent as AgentEnum} from '../../data/Agent';

export interface IAgentState {
    enum: AgentEnum;
    name?: string;
    genderEnabled: boolean;
    speed: number;
    strength: number;

    lastTurn?: number;
    gender?: Gender;
    spriteCount?: number;
    defaultSpriteFrame?: number;
    spriteIndex?: number;
    inventory?: number[];
    dead?: boolean;
    traits?: AgentTraits[];
    corpseSprite?: PIXI.Sprite;

    // Info about agent that last attacked this agent
    lastAttacker?: number;
    lastAttacked?: number;

    buildingInsideOf?: number;
}

export interface IAgentComponent extends IComponent {
    state: IAgentState;
}

export let Agent: IAgentComponent = {
    name: 'agent',
    enum: Component.Agent,
    state: {
        enum: AgentEnum.Zombie,
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
        strength: 1,
        buildingInsideOf: null
    }
};