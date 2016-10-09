import {StateManager} from '../state-manager';

export interface IState {
    manager: StateManager;

    create (done: Function): void;
    shutdown (): void;
    preload? (): void;
}