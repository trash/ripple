import {b3} from '../index';
import {Composite} from './composite';
import {Tick} from './tick';

/**
 * MemPriority is similar to Priority node, but when a child returns a
 * `RUNNING` state, its index is recorded and in the next tick the,
 * MemPriority calls the child recorded directly, without calling previous
 * children again.
 *
 * @module b3
 * @class MemPriority
 * @extends Composite
**/
export let MemPriority = b3.Class(Composite, {

  /**
   * Node name. Default to `MemPriority`.
   * @property {String} name
   * @readonly
  **/
  name: 'MemPriority',

  /**
   * Open method.
   * @method open
   * @param {b3.Tick} tick A tick instance.
  **/
  open: function(tick: Tick) {
    tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
  },

  /**
   * Tick method.
   * @method tick
   * @param {b3.Tick} tick A tick instance.
   * @return {Constant} A state constant.
  **/
  tick: function(tick: Tick) {
    var child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
    for (var i=child; i<this.children.length; i++) {
      var status = this.children[i]._execute(tick);

      if (status !== b3.FAILURE) {
        if (status === b3.RUNNING) {
          tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
        }

        return status;
      }
    }

    return b3.FAILURE;
  }
});

