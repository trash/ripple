import {Profession} from './profession';

export enum VillagerJob {
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
    id?: VillagerJob,
    professions: Profession[];
    readableName?: string;
};
export interface IVillagerJobMap {
    [key: number]: IVillagerJob;
}

export const villagerJobsMap: IVillagerJobMap = {
    [VillagerJob.Unemployed]: {
        professions: [
            Profession.Citizen
        ]
    },
    [VillagerJob.Laborer]: {
        professions: [
            Profession.Gatherer,
            Profession.Woodcutter,
            Profession.Miner
        ]
    },
    [VillagerJob.Guard]: {
        professions: [
            Profession.Guard
        ]
    },
    [VillagerJob.Builder]: {
        professions: [
            Profession.Builder,
            Profession.Woodcutter
        ]
    },
    [VillagerJob.Blacksmith]: {
        professions: [
            Profession.Miner,
            Profession.Blacksmith
        ]
    },
    [VillagerJob.Farmer]: {
        professions: [
            Profession.Farmer,
            Profession.Gatherer
        ]
    },
    [VillagerJob.Fisherman]: {
        professions: [
            Profession.Fisherman
        ]
    },
    [VillagerJob.Shopkeeper]: {
        professions: [
            Profession.Shopkeeper
        ]
    }
};

Object.keys(villagerJobsMap).forEach(enumIdString => {
    let enumId = parseInt(enumIdString);
    let villagerJob = villagerJobsMap[enumId];
    villagerJob.readableName = VillagerJob[enumId];
    villagerJob.id = enumId;
})