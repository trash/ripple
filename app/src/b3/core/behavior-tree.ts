/**
 * BehaviorTree
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

import {b3} from '../index';
import {Tick} from './tick';
import {BaseNode} from './base-node';
import {Composite} from './composite';
import {Blackboard} from './blackboard';
import {IBehaviorTreeTickTarget} from '../../interfaces';

/**
 * The BehaviorTree class, as the name implies, represents the Behavior Tree
 * structure.
 *
 * There are two ways to construct a Behavior Tree: by manually setting the
 * root node, or by loading it from a data structure (which can be loaded from
 * a JSON). Both methods are shown in the examples below and better explained
 * in the user guide.
 *
 * The tick method must be called periodically, in order to send the tick
 * signal to all nodes in the tree, starting from the root. The method
 * `BehaviorTree.tick` receives a target object and a blackboard as parameters.
 * The target object can be anything: a game agent, a system, a DOM object,
 * etc. This target is not used by any piece of Behavior3JS, i.e., the target
 * object will only be used by custom nodes.
 *
 * The blackboard is obligatory and must be an instance of `Blackboard`. This
 * requirement is necessary due to the fact that neither `BehaviorTree` or any
 * node will store the execution variables in its own object (e.g., the BT does
 * not store the target, information about opened nodes or number of times the
 * tree was called). But because of this, you only need a single tree instance
 * to control multiple (maybe hundreds) objects.
 *
 * Manual construction of a Behavior Tree
 * --------------------------------------
 *
 *     var tree = new b3.BehaviorTree();
 *
 *     tree.root = new b3.Sequence({children:[
 *         new b3.Priority({children:[
 *             new MyCustomNode(),
 *             new MyCustomNode()
 *         ]}),
 *         ...
 *     ]});
 *
 *
 * Loading a Behavior Tree from data structure
 * -------------------------------------------
 *
 *     var tree = new b3.BehaviorTree();
 *
 *     tree.load({
 *         'title'       : 'Behavior Tree title'
 *         'description' : 'My description'
 *         'root'        : 'node-id-1'
 *         'nodes'       : {
 *             'node-id-1' : {
 *                 'name'        : 'Priority', // this is the node type
 *                 'title'       : 'Root Node',
 *                 'description' : 'Description',
 *                 'children'    : ['node-id-2', 'node-id-3'],
 *             },
 *             ...
 *         }
 *     })
 *
 *
 * @class BehaviorTree
**/
export class BehaviorTree {
    id: string;
    name: string;
    title: string;
    description: string;
    /**
     * The reference to the root node. Must be an instance of `b3.BaseNode`.
     *
     * @property root
     * @type {BaseNode}
     */
    root: Composite;

    constructor () {
        this.id = b3.createUUID();
        this.title = 'The behavior tree';
        this.description = 'Default description';
        this.root = null;
    }

    getExecutionChain () {
        return this.root.childrenStatus;
    }

    /**
     * Propagates the tick signal through the tree, starting from the root.
     *
     * This method receives a target object of any type (Object, Array,
     * DOMElement, whatever) and a `Blackboard` instance. The target object has
     * no use at all for all Behavior3JS components, but surely is important
     * for custom nodes. The blackboard instance is used by the tree and nodes
     * to store execution variables (e.g., last node running) and is obligatory
     * to be a `Blackboard` instance (or an object with the same interface).
     *
     * Internally, this method creates a Tick object, which will store the
     * target and the blackboard objects.
     *
     * Note: BehaviorTree stores a list of open nodes from last tick, if these
     * nodes weren't called after the current tick, this method will close them
     * automatically.
     *
     * @method tick
     * @param {Object} target A target object.
     * @param {Blackboard} blackboard An instance of blackboard object.
     * @returns {Constant} The tick signal state.
    **/
    tick (target: IBehaviorTreeTickTarget, blackboard: Blackboard): number {
        if (!blackboard) {
            throw 'The blackboard parameter is obligatory and must be an ' +
                    'instance of b3.Blackboard';
        }

        /* CREATE A TICK OBJECT */
        var tick = new Tick();
        tick.target = target;
        tick.blackboard = blackboard;
        tick.tree = this;

        /* TICK NODE */
        const state = this.root._execute(tick);

        // Store the last execution chains
        blackboard.set('lastExecutionChain', blackboard.getNodeExecutionChains(this.id),
            this.id);
        // Clear execution chains
        blackboard.clearNodeExecutionChain(this.id);

        /* CLOSE NODES FROM LAST TICK, IF NEEDED */
        const lastOpenNodes = blackboard.get('openNodes', this.id);
        const currOpenNodes = tick._openNodes.slice(0);

        // does not close if it is still open in this tick
        let start = 0;
        for (let i = 0; i < Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
            start = i+1;
            if (lastOpenNodes[i] !== currOpenNodes[i]) {
                break;
            }
        }

        // close the nodes
        for (var i=lastOpenNodes.length-1; i>=start; i--) {
            lastOpenNodes[i]._close(tick);
        }

        /* POPULATE BLACKBOARD */
        blackboard.set('openNodes', currOpenNodes, this.id);
        blackboard.set('lastOpenNodes', lastOpenNodes, this.id);
        blackboard.set('nodeCount', tick._nodeCount, this.id);

        return state;
    }
}
