import {StatusCode} from '../index';
import * as Action from '../Actions';

export const Log = (
    message: string,
    status?: StatusCode
) => new Action.Simple(() => console.log(message));