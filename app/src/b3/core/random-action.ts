import {b3} from '../index';
import _ = require('lodash');
import {Composite} from './composite';
import {Tick} from './tick';

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
        var currentPickedChild = tick.blackboard.get('currentPickedChild', tick.tree.id, this.id);
        // If there's no random child we're executing, pick one
        if (!_.isNumber(currentPickedChild)) {
            currentPickedChild = Math.floor(Math.random() * this.children.length);
            tick.blackboard.set('currentPickedChild', currentPickedChild, tick.tree.id, this.id);
        }
        var status = this.children[currentPickedChild]._execute(tick);

        if (status === b3.RUNNING) {
            return status;
        }
        // Child finished, clear it so we can pick another
        tick.blackboard.set('currentPickedChild', null, tick.tree.id, this.id);

        return b3.SUCCESS;
    }
};


/**
 * Node name. Default to `RandomAction`.
 *
 * @property name
 * @type {String}
 * @readonly
**/
RandomAction.prototype.name = 'RandomAction';
