import {GameMap} from '../Src/Map';
import {TileData} from '../Src/Map/TileData';
import {MapGenerator} from '../Src/Map/MapGenerator';

describe('MapGenerator', () => {
    let sut: MapGenerator;
    const dimension = 10;
    const seed = 666;
    const startInput = Array(Math.pow(dimension, 2)).fill('test');

    beforeEach(() => {
        sut = new MapGenerator(dimension, seed, GameMap.ForestBiome, false, false);
    });

    test('the seed is deterministic', () => {
        const sut2 = new MapGenerator(dimension, seed, GameMap.ForestBiome, false, false);

        const output = sut.generate(true);
        const output2 = sut2.generate(true);

        expect(output).toEqual(output2);
    });

    describe('generateWater', () => {
        test('it is deterministic based on the seed', () => {
            const output = sut.generateWater(startInput);
            const output2 = sut.generateWater(startInput);

            expect(output).toEqual(output2);
        });

        test('generates no water tiles if allLand is true', () => {
            sut['allLand'] = true;

            const output = sut.generateWater(startInput);

            output.forEach(tile => expect(tile).not.toBe(TileData.waterFull))
        });
    });

    describe('normalizeWaterTiles', () => {
        test('it is deterministic based on the seed', () => {
            const input = sut.generateWater(startInput);

            const output = sut.normalizeWaterTiles(input);
            const output2 = sut.normalizeWaterTiles(input);

            expect(output).toEqual(output2);
        });
    });
});