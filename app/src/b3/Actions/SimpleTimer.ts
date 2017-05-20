import * as Actions from '../Actions';

export const SimpleTimer = (
    cb: Actions.SimpleTickCallback,
    hours: number
) => new Actions.Simple(tick => {
    tick.target.clock.timer(hours, () => cb(tick));
});