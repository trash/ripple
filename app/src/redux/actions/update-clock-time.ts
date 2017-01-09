import {MapTile} from '../../map/tile';
import {actionTypes} from './types';

export interface UpdateClockTime {
    type: string;
    hours: number;
    days: number;
}

export function updateClockTime (hours: number, days: number): UpdateClockTime {
    return {
        type: actionTypes.UPDATE_CLOCK_TIME,
        hours: hours,
        days: days
    };
}