import {GameMap} from '../Src/Map';
import {TileData} from '../Src/Map/TileData';
import {MapGenerator} from '../Src/Map/MapGenerator';


describe('MapGenerator', () => {
    let sut: MapGenerator;
    const dimension = 10;
    const seed = 666;

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
        test('generates no water tiles if allLand is true', () => {
            const input = Array(Math.pow(dimension, 2)).fill('test');
            sut['allLand'] = true;

            const output = sut.generateWater(input);

            output.forEach(tile => expect(tile).not.toBe(TileData.waterFull))
        });
    });
});