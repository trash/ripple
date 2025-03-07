import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {Gender} from '../../interfaces';
import {Agent as AgentEnum} from '../../data/Agent';
import {AgentTrait} from '../../data/AgentTrait';

export interface IAgentState {
    enum: AgentEnum;
    spriteType?: string;
    nameType?: string;
    genderEnabled: boolean;
    speed: number;
    strength: number;

    lastTurn?: number;
    gender?: Gender;
    spriteCount?: number;
    defaultSpriteFrame?: number;
    spriteIndex?: number;
    dead?: boolean;
    traits?: AgentTrait[];
    corpseSprite?: PIXI.Sprite;

    // Info about agent that last attacked this agent
    lastAttacker?: number;
    lastAttacked?: number;

    buildingInsideOf?: number;
}

export const Agent: IComponent<IAgentState> = {
    name: 'agent',
    enum: Component.Agent,
    getInitialState: () => {
        return {
            enum: AgentEnum.Zombie,
            genderEnabled: false,
            gender: null,
            // spriteType: null,
            nameType: null,
            defaultSpriteFrame: 0,
            spriteCount: null,
            spriteIndex: null,
            lastTurn: 0,
            speed: 15,
            dead: false,
            traits: [],
            strength: 1,
            buildingInsideOf: null
        };
    }
};