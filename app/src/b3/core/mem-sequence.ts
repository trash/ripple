import {b3} from '../index';
import {Composite} from './composite';
import {Tick} from './tick';

/**
 * MemSequence is similar to Sequence node, but when a child returns a
 * `RUNNING` state, its index is recorded and in the next tick the
 * MemPriority call the child recorded directly, without calling previous
 * children again.
 *
 * @module b3
 * @class MemPriority
 * @extends Composite
**/
export class MemSequence extends Composite {

  /**
   * Node name. Default to `MemSequence`.
   * @property {String} name
   * @readonly
  **/
  name: 'MemSequence';

  /**
   * Open method.
   * @method open
   * @param {b3.Tick} tick A tick instance.
  **/
  open (tick: Tick) {
    tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
  }

  /**
   * Tick method.
   * @method tick
   * @param {b3.Tick} tick A tick instance.
   * @return {Constant} A state constant.
  **/
  tick (tick: Tick) {
    var child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
    for (var i=child; i<this.children.length; i++) {
      var status = this.children[i]._execute(tick);

      if (status !== b3.SUCCESS) {
        if (status === b3.RUNNING) {
          tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
        }
        return status;
      }
    }

    return b3.SUCCESS;
  }
};
