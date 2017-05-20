import {GameMap} from '../Src/Map';
import {TileData} from '../Src/Map/TileData';
import {MapGenerator} from '../Src/Map/MapGenerator';

describe('MapGenerator', () => {
    let sut: MapGenerator;
    const dimension = 10;
    const seed = 666;

    beforeEach(() => {
        sut = new MapGenerator(dimension, seed, GameMap.ForestBiome);
    });

    describe('generateWater', () => {
        test('generates all water tiles if allLand is false', () => {
            const input = Array(Math.pow(dimension, 2)).fill('test');

            const output = sut.generateWater(input);

            output.forEach(tile => expect(tile).toBe(TileData.waterFull))
        });
    });
});