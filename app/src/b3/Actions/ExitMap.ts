import * as Action from '../Actions';
import {baseUtil} from '../../entity/util';

export const ExitMap = () => new Action.Simple(tick =>
    baseUtil.destroyEntity(tick.target.id));