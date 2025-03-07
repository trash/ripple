import {Profession} from './Profession';

export enum VillagerJob {
    Laborer = 1,
    Guard,
    Builder,
    // Farmer,
    // Fisherman,
    Blacksmith,
    Unemployed,
    Shopkeeper,
    Carpenter
}

export interface IVillagerJob {
    enum?: VillagerJob,
    professions: Profession[];
    readableName?: string;
};
export interface IVillagerJobMap {
    [key: number]: IVillagerJob;
}

export const villagerJobsMap: IVillagerJobMap = {
    [VillagerJob.Unemployed]: {
        professions: [
            Profession.Hauler
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
    // [VillagerJob.Farmer]: {
    //     professions: [
    //         Profession.Farmer,
    //         Profession.Gatherer
    //     ]
    // },
    // [VillagerJob.Fisherman]: {
    //     professions: [
    //         Profession.Fisherman
    //     ]
    // },
    [VillagerJob.Shopkeeper]: {
        professions: [
            Profession.Shopkeeper
        ]
    },
    [VillagerJob.Carpenter]: {
        professions: [
            Profession.Carpenter,
            Profession.Woodcutter,
            Profession.Builder
        ]
    }
};

Object.keys(villagerJobsMap).forEach(enumIdString => {
    let enumId = parseInt(enumIdString);
    let villagerJob = villagerJobsMap[enumId];
    villagerJob.readableName = VillagerJob[enumId];
    villagerJob.enum = enumId;
})