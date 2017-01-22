import {Professions} from './professions';

export enum VillagerJobs {
    Laborer,
    Guard,
    Builder,
    Farmer,
    Fisherman,
    Blacksmith,
    Unemployed,
    Shopkeeper
}

export interface IVillagerJob {
    id?: VillagerJobs,
    professions: Professions[];
    readableName?: string;
};
export interface IVillagerJobMap {
    [key: number]: IVillagerJob;
}

export const villagerJobsMap: IVillagerJobMap = {
    [VillagerJobs.Unemployed]: {
        professions: [
            Professions.Citizen
        ]
    },
    [VillagerJobs.Laborer]: {
        professions: [
            Professions.Gatherer,
            Professions.Woodcutter,
            Professions.Miner
        ]
    },
    [VillagerJobs.Guard]: {
        professions: [
            Professions.Guard
        ]
    },
    [VillagerJobs.Builder]: {
        professions: [
            Professions.Builder,
            Professions.Woodcutter
        ]
    },
    [VillagerJobs.Blacksmith]: {
        professions: [
            Professions.Miner,
            Professions.Blacksmith
        ]
    },
    [VillagerJobs.Farmer]: {
        professions: [
            Professions.Farmer,
            Professions.Gatherer
        ]
    },
    [VillagerJobs.Fisherman]: {
        professions: [
            Professions.Fisherman
        ]
    },
    [VillagerJobs.Shopkeeper]: {
        professions: [
            Professions.Shopkeeper
        ]
    }
};

Object.keys(villagerJobsMap).forEach(enumIdString => {
    let enumId = parseInt(enumIdString);
    let villagerJob = villagerJobsMap[enumId];
    villagerJob.readableName = VillagerJobs[enumId];
    villagerJob.id = enumId;
})