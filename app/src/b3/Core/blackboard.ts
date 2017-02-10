/**
 * Blackboard
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
import * as Core from './index';
import {uniqueId} from '../../unique-id';

interface LastNodeExecutionChain {
    success: Core.ChildStatus[];
    full: Core.ChildStatus[];
}

interface TreeMemoryInstance {
    lastOpenNodes: any[];
    nodeCount: number;

    nodeMemory: {};
    openNodes: any[];
    traversalCycle: number;
    traversalDepth: number;

    lastNodeExecutionChain: LastNodeExecutionChain;
}



interface TreeMemoryMap {
    [key: string]: TreeMemoryInstance;
}

/**
 * The Blackboard is the memory structure required by `BehaviorTree` and its
 * nodes. It only have 2 public methods: `set` and `get`. These methods works
 * in 3 different contexts: global, per tree, and per node per tree.
 *
 * Suppose you have two different trees controlling a single object with a
 * single blackboard, then:
 *
 * - In the global context, all nodes will access the stored information.
 * - In per tree context, only nodes sharing the same tree share the stored
 *   information.
 * - In per node per tree context, the information stored in the blackboard can
 *   only be accessed by the same node that wrote the data.
 *
 * The context is selected indirectly by the parameters provided to these
 * methods, for example:
 *
 *     // getting/setting variable in global context
 *     blackboard.set('testKey', 'value');
 *     var value = blackboard.get('testKey');
 *
 *     // getting/setting variable in per tree context
 *     blackboard.set('testKey', 'value', tree.id);
 *     var value = blackboard.get('testKey', tree.id);
 *
 *     // getting/setting variable in per node per tree context
 *     blackboard.set('testKey', 'value', tree.id, node.id);
 *     var value = blackboard.get('testKey', tree.id, node.id);
 *
 * Note: Internally, the blackboard store these memories in different objects,
 *  being the global on `_baseMemory`, the per tree on `_treeMemory` and the
 *  per node per tree dynamically create inside the per tree memory (it is
 *  accessed via `_treeMemory[id].nodeMemory`). Avoid to use these variables
 *  manually, use `get` and `set` instead.
 *
 * @class Blackboard
**/
export class Blackboard {
    _baseMemory: {};
    _treeMemory: TreeMemoryMap;
    id: string;

    constructor () {
        this.id = uniqueId.get();
        this._baseMemory = {};
        this._treeMemory = {};
    }

    getNodeExecutionChains (treeScope: string): LastNodeExecutionChain {
        const chains = this._getTreeMemory(treeScope).lastNodeExecutionChain;
        return {
            success: [].concat(chains.success),
            full: [].concat(chains.full)
        };
    }

    addNodeToExecutionChain (
        treeScope: string,
        node: Core.BaseNode,
        status: StatusCode
    ): number {
        // console.log('Adding node: ', node, b3.humanReadableStatus(status));

        const chains = this._getTreeMemory(treeScope).lastNodeExecutionChain;
        const childStatus = {
            child: node,
            status: status,
            readableStatus: b3.humanReadableStatus(status)
        };
        if (status === StatusCode.SUCCESS || status === StatusCode.RUNNING) {
            chains.success.push(childStatus);
        }
        chains.full.push(childStatus);
        return chains.full.length;
    }
    clearNodeExecutionChain (treeScope: string) {
        const chains = this._getTreeMemory(treeScope).lastNodeExecutionChain;
        chains.full = [];
        chains.success = [];
    }

    /**
     * Internal method to retrieve the tree context memory. If the memory does
     * not exist, this method creates it.
     *
     * @method _getTreeMemory
     * @param {string} treeScope The id of the tree in scope.
     * @returns {Object} The tree memory.
     * @protected
    **/
    _getTreeMemory (treeScope: string): TreeMemoryInstance {
        if (!this._treeMemory[treeScope]) {
            this._treeMemory[treeScope] = {
                nodeMemory : {},
                openNodes : [],
                traversalCycle : 0,
                traversalDepth : 0,
                lastOpenNodes: null,
                nodeCount: null,
                lastNodeExecutionChain: {
                    full: [],
                    success: []
                }
            };
        }
        return this._treeMemory[treeScope];
    }

     _getNodeMemory (treeMemory: TreeMemoryInstance, nodeScope: string) {
         const memory = treeMemory.nodeMemory;
         if (!memory[nodeScope]) {
             memory[nodeScope] = {};
         }

         return memory[nodeScope];
     }

    /**
     * Internal method to retrieve the context memory. If treeScope and
     * nodeScope are provided, this method returns the per node per tree
     * memory. If only the treeScope is provided, it returns the per tree
     * memory. If no parameter is provided, it returns the global memory.
     * Notice that, if only nodeScope is provided, this method will still
     * return the global memory.
     *
     * @method _getMemory
     * @param {String} treeScope The id of the tree scope.
     * @param {String} nodeScope The id of the node scope.
     * @returns {Object} A memory object.
     * @protected
    **/
    _getMemory (treeScope?: string, nodeScope?: string): any {
        if (treeScope) {
             const memory = this._getTreeMemory(treeScope);
             if (nodeScope) {
                 return this._getNodeMemory(memory, nodeScope);
             }
             return memory;
        }
        return this._baseMemory;
    }

    /**
     * Stores a value in the blackboard. If treeScope and nodeScope are
     * provided, this method will save the value into the per node per tree
     * memory. If only the treeScope is provided, it will save the value into
     * the per tree memory. If no parameter is provided, this method will save
     * the value into the global memory. Notice that, if only nodeScope is
     * provided (but treeScope not), this method will still save the value into
     * the global memory.
     *
     * @method set
     * @param {String} key The key to be stored.
     * @param {String} value The value to be stored.
     * @param {String} treeScope The tree id if accessing the tree or node
     *                           memory.
     * @param {String} nodeScope The node id if accessing the node memory.
    **/
    set (
        key: string,
        value: any,
        treeScope: string,
        nodeScope?: string
    ) {
        const memory = this._getMemory(treeScope, nodeScope);
        memory[key] = value;
    }

    /**
     * Retrieves a value in the blackboard. If treeScope and nodeScope are
     * provided, this method will retrieve the value from the per node per tree
     * memory. If only the treeScope is provided, it will retrieve the value
     * from the per tree memory. If no parameter is provided, this method will
     * retrieve from the global memory. If only nodeScope is provided (but
     * treeScope not), this method will still try to retrieve from the global
     * memory.
     *
     * @method get
     * @param {String} key The key to be retrieved.
     * @param {String} treeScope The tree id if accessing the tree or node
     *                           memory.
     * @param {String} nodeScope The node id if accessing the node memory.
     * @returns {Object} The value stored or undefined.
    **/
    get (
        key: string,
        treeScope: string,
        nodeScope?: string
    ) {
        const memory = this._getMemory(treeScope, nodeScope);
        return memory[key];
    }
}