import {StateManager} from '../state-manager';

export interface State {
    manager: StateManager;

    create (): void
    shutdown (): void
    preload? (): void
}