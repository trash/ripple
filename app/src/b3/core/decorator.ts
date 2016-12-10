import {b3} from '../index';
import {BaseNode} from './base-node';
/**
 * Decorator is the base class for all decorator nodes. Thus, if you want to
 * create new custom decorator nodes, you need to inherit from this class.
 *
 * When creating decorator nodes, you will need to propagate the tick signal
 * to the child node manually, just like the composite nodes. To do that,
 * override the `tick` method and call the `_execute` method on the child
 * node. For instance, take a look at how the Inverter node inherit this
 * class and how it call its children:
 * @module b3
 * @class Decorator
 * @extends BaseNode
**/

export interface IDecoratorOptions {
	child: BaseNode;
}

export class Decorator extends BaseNode {
	child: BaseNode;

	constructor (options: IDecoratorOptions) {
        super();
        this.initialize(options);
    }

	/**
	 * Initialization method.
	 * @method initialize
	 * @constructor
	**/
	initialize (options: IDecoratorOptions) {
		super.initialize();
		this.child = options.child || null;
	}
};