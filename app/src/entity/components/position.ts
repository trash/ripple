import {IComponent} from '../entity-manager';
import {ComponentEnum} from '../component-enum';
import {IRowColumnCoordinates} from '../../interfaces';

export interface IPositionState {
    tile: IRowColumnCoordinates;
    previousTile?: IRowColumnCoordinates;
    direction?: string;
    hasDirection?: boolean;
    turnUpdated?: number; // Turn the position was changed
    turnCompleted?: number; // Turn the move should complete
}

export interface IPositionComponent extends IComponent {
    state: IPositionState;
}

export let Position: IPositionComponent = {
    name: 'position',
    enum: ComponentEnum.Position,
    state: {
        tile: null,
        previousTile: null,
        direction: null,
        turnUpdated: null,
        turnCompleted: null,
        hasDirection: false
    }
};