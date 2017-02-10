/**
 * Composite
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

/**
 * Composite is the base class for all composite nodes. Thus, if you want to
 * create new custom composite nodes, you need to inherit from this class.
 *
 * When creating composite nodes, you will need to propagate the tick signal to
 * the children nodes manually. To do that, override the `tick` method and call
 * the `_execute` method on all nodes. For instance, take a look at how the
 * Sequence node inherit this class and how it call its children:
 * @class Composite
 * @extends BaseNode
**/

export interface ICompositeOptions {
    children: Core.BaseNode[];
};

export class Composite extends Core.BaseNode {
    children: Core.BaseNode[];

    /**
     * Node category. Default to `b3.COMPOSITE`.
     *
     * @property category
     * @type {String}
     * @readonly
    **/
    static category = b3.COMPOSITE;

    initialize (options: ICompositeOptions) {
        super.initialize();

        this.children = (options.children || []).slice(0);
        this.childrenStatus = [];
    }

    _execute (tick: Core.Tick): StatusCode {
        this.childrenStatus = [];

        return super._execute(tick);
    }
}