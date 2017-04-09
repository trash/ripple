import {IComponent} from '../entityManager';
import {Component} from '../ComponentEnum';
import {IRowColumnCoordinates} from '../../interfaces';

export interface IPositionState {
    // Dirty flag to improve performance when rendering
    dirty?: boolean;
    tile: IRowColumnCoordinates;
    previousTile?: IRowColumnCoordinates;
    direction?: string;
    hasDirection?: boolean;
    turnUpdated?: number; // Turn the position was changed
    turnCompleted?: number; // Turn the move should complete
}

export const Position: IComponent<IPositionState> = {
    name: 'position',
    enum: Component.Position,
    getInitialState: () => {
        return {
            dirty: true,
            tile: null,
            previousTile: null,
            direction: null,
            turnUpdated: null,
            turnCompleted: null,
            hasDirection: false
        };
    }
};