export enum Building {
    Hut,
    House,
    Storage,
    Tavern,
    CarpenterShop,
}

export const buildingToNameMap = new Map<number, string>([
    [Building.Hut, 'hut'],
    [Building.House, 'house'],
    [Building.Storage, 'storage'],
    [Building.Tavern, 'tavern'],
    [Building.CarpenterShop, 'carpenter-shop'],
]);

