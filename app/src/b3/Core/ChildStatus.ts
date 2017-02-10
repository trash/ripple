import {StatusCode} from '../index';
import * as Core from './index';

export interface ChildStatus {
    child: Core.BaseNode;
    status: StatusCode;
    readableStatus: string;
}