import {professions} from './professions';

export enum villagerJobs {
    laborer,
    guard,
    builder,
    farmer,
    fisherman,
    blacksmith,
    unemployed,
    shopkeeper
}

export interface IVillagerJob {
    id?: villagerJobs,
    professions: professions[];
    readableName?: string;
};
export interface IVillagerJobMap {
    [key: number]: IVillagerJob;
}

export const villagerJobsMap: IVillagerJobMap = {
    [villagerJobs.unemployed]: {
        professions: [
            professions.citizen
        ]
    },
    [villagerJobs.laborer]: {
        professions: [
            professions.gatherer,
            professions.woodcutter,
            professions.miner
        ]
    },
    [villagerJobs.guard]: {
        professions: [
            professions.guard
        ]
    },
    [villagerJobs.builder]: {
        professions: [
            professions.builder,
            professions.woodcutter
        ]
    },
    [villagerJobs.blacksmith]: {
        professions: [
            professions.miner,
            professions.blacksmith
        ]
    },
    [villagerJobs.farmer]: {
        professions: [
            professions.farmer,
            professions.gatherer
        ]
    },
    [villagerJobs.fisherman]: {
        professions: [
            professions.fisherman
        ]
    },
    [villagerJobs.shopkeeper]: {
        professions: [
            professions.shopkeeper
        ]
    }
};

Object.keys(villagerJobsMap).forEach(enumIdString => {
    let enumId = parseInt(enumIdString);
    let villagerJob = villagerJobsMap[enumId];
    villagerJob.readableName = villagerJobs[enumId];
    villagerJob.id = enumId;
})