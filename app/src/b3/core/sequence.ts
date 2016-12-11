/**
 * Sequence
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
import {Composite} from './composite';
import {Tick} from './tick';

/**
 * The Sequence node ticks its children sequentially until one of them returns
 * `FAILURE`, `RUNNING` or `ERROR`. If all children return the success state,
 * the sequence also returns `SUCCESS`.
 *
 * @class Sequence
 * @extends Composite
**/
export class Sequence extends Composite {
    tick (tick: Tick) {
        for (let i = 0; i < this.children.length; i++) {
            const status = this.executeChild(tick, this.children[i]);

            if (status !== b3.SUCCESS) {
                return status;
            }
        }

        return b3.SUCCESS;
    }
}