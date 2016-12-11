/**
 * BaseNode
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

import {b3, StatusCode} from '../index';
import {Tick} from './tick';
import {util} from '../../util';

/**
 * The BaseNode class is used as super class to all nodes in BehaviorJS. It
 * comprises all common variables and methods that a node must have to execute.
 *
 * **IMPORTANT:** Do not inherit from this class, use `b3.Composite`,
 * `b3.Decorator`, `b3.Action` or `b3.Condition`, instead.
 *
 * The attributes are specially designed to serialization of the node in a JSON
 * format. In special, the `parameters` attribute can be set into the visual
 * editor (thus, in the JSON file), and it will be used as parameter on the
 * node initialization at `BehaviorTree.load`.
 *
 * BaseNode also provide 5 callback methods, which the node implementations can
 * override. They are `enter`, `open`, `tick`, `close` and `exit`. See their
 * documentation to know more. These callbacks are called inside the `_execute`
 * method, which is called in the tree traversal.
 *
 * @class BaseNode
**/
export class BaseNode {
    id: string;
    title: string;
    name: string;
    description: string;
    category: string;
    children: BaseNode[];
    child: BaseNode;

    constructor (...args) {
        this.initialize(...args);
    }

    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    initialize (...args) {
        this.id = b3.createUUID();
        this.title = this.title || this.name;
    }

    /**
     * This is the main method to propagate the tick signal to this node. This
     * method calls all callbacks: `enter`, `open`, `tick`, `close`, and
     * `exit`. It only opens a node if it is not already open. In the same
     * way, this method only close a node if the node  returned a status
     * different of `b3.RUNNING`.
     *
     * @method _execute
     * @param {Tick} tick A tick instance.
     * @returns {Constant} The tick state.
     * @protected
    **/
    _execute (tick: Tick): StatusCode {
        /* ENTER */
        this._enter(tick);

        /* OPEN */
        if (!util.blackboardGet(tick, 'isOpen', this.id)) {
            this._open(tick);
        }

        /* TICK */
        const status = this._tick(tick);

        /* CLOSE */
        if (status !== b3.RUNNING) {
            this._close(tick);
        } else {
            const description = this._getDescription();
            if (description) {
                tick.target.behaviorTree.currentAction = description;
            }
        }

        /* EXIT */
        this._exit(tick);

        tick.blackboard.addNodeToExecutionChain(tick.tree.id, this, status);

        return status;
    }

    /**
     * Wrapper for enter method.
     *
     * @method _enter
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    _enter (tick: Tick) {
        tick._enterNode(this);
        this.enter(tick);
    }

    _getDescription () {
        return this.description;
    }

    setDescription (tick: Tick, description: string) {
        this.description = description;
        // tick.target.currentAction = this.description;
    };

    /**
     * Wrapper for open method.
     *
     * @method _open
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    _open (tick: Tick) {
        tick._openNode(this);
        util.blackboardSet(tick, 'isOpen', true, this.id);
        this.open(tick);
    }

    /**
     * Wrapper for tick method.
     *
     * @method _tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
     * @protected
    **/
    _tick (tick: Tick): number {
        tick._tickNode(this);
        const tickReturns = this.tick(tick);

        return tickReturns;
    }

    /**
     * Wrapper for close method.
     *
     * @method _close
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    _close (tick: Tick) {
        tick._closeNode(this);
        util.blackboardSet(tick, 'isOpen', false, this.id);
        this.close(tick);
    }

    /**
     * Wrapper for exit method.
     *
     * @method _exit
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    _exit (tick: Tick) {
        tick._exitNode(this);
        this.exit(tick);
    }

    /**
     * Enter method, override this to use. It is called every time a node is
     * asked to execute, before the tick itself.
     *
     * @method enter
     * @param {Tick} tick A tick instance.
    **/
    enter (tick: Tick) {}

    /**
     * Open method, override this to use. It is called only before the tick
     * callback and only if the not isn't closed.
     *
     * Note: a node will be closed if it returned `b3.RUNNING` in the tick.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    open (tick: Tick) {}

    /**
     * Tick method, override this to use. This method must contain the real
     * execution of node (perform a task, call children, etc.). It is called
     * every time a node is asked to execute.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
    **/
    tick (tick: Tick): StatusCode {
        return b3.SUCCESS;
    }

    /**
     * Close method, override this to use. This method is called after the tick
     * callback, and only if the tick return a state different from
     * `b3.RUNNING`.
     *
     * @method close
     * @param {Tick} tick A tick instance.
    **/
    close (tick: Tick) {}

    /**
     * Exit method, override this to use. Called every time in the end of the
     * execution.
     *
     * @method exit
     * @param {Tick} tick A tick instance.
    **/
    exit (tick: Tick) {}
}