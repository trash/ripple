import {b3} from '../index';
import * as _ from 'lodash';;
import {Composite} from './composite';
import {Tick} from './tick';
import {util} from '../../util';

/**
 * The RandomAction node picks a random child then executes it. It returns
 * SUCCESS when the child is done executing.
 *
 * @class RandomAction
 * @extends Composite
**/
export class RandomAction extends Composite {
    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    tick (tick: Tick) {
        let currentPickedChild = util.blackboardGet(tick, 'currentPickedChild', this.id);
        // If there's no random child we're executing, pick one
        if (!_.isNumber(currentPickedChild)) {
            currentPickedChild = Math.floor(Math.random() * this.children.length);
            util.blackboardSet(tick, 'currentPickedChild', currentPickedChild, this.id);
        }
        const status = this.children[currentPickedChild]._execute(tick);

        if (status === b3.RUNNING) {
            return status;
        }
        // Child finished, clear it so we can pick another
        util.blackboardSet(tick, 'currentPickedChild', null, this.id);

        return b3.SUCCESS;
    }
}