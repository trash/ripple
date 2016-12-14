import {StatusCode} from '../index';
import {BaseNode} from './base-node';

export interface ChildStatus {
    child: BaseNode;
    status: StatusCode;
    readableStatus: string;
}