import {IRowColumnCoordinates} from '../../interfaces';
import {Component} from '../ComponentEnum';
import {BaseUtil} from './base';
import {Profession} from '../../data/Profession';
import {IVillagerState} from '../components';
import {villagerJobsMap} from '../../data/VillagerJob';

export class VillagerUtil extends BaseUtil {
	hasProfession (villagerState: IVillagerState, profession: Profession): boolean {
        const job = villagerJobsMap[villagerState.job];
        return job.professions.includes(profession);
    }
}

export const villagerUtil = new VillagerUtil();