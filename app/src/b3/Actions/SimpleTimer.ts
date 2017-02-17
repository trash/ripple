import * as Actions from '../Actions';
import {gameClock} from '../../game/game-clock';

export const SimpleTimer = (
    cb: Actions.SimpleTickCallback,
    hours: number
) => new Actions.Simple(tick => {
    gameClock.timer(hours, () => cb(tick));
});