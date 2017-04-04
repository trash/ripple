import * as changeCase from 'change-case';
import * as _ from 'lodash';
import {BaseUtil} from './base';
import {constants} from '../../data/constants';
import {Resource} from '../../data/Resource';

export class ResourceUtil extends BaseUtil {
    getName(resource: Resource): string {
        return changeCase.paramCase(Resource[resource]);
    }

    getImagePath(
        resource: Resource
	): string {
		const resourceName = this.getName(resource);
		return `${constants.SPRITE_PATH}map/${resourceName}.png`;
	}
}

export const resourceUtil = new ResourceUtil();