import {MapTile} from '../../map/tile';
import {UPDATE_CLOCK_TIME} from './types';

export interface UpdateClockTime {
    type: UPDATE_CLOCK_TIME;
    hours: number;
    days: number;
}

export function updateClockTime (hours: number, days: number): UpdateClockTime {
    return {
        type: UPDATE_CLOCK_TIME,
        hours: hours,
        days: days
    };
}