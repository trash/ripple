import * as Immutable from 'immutable';
import {MapGenTile} from '../Src/Map/MapGenTile';
import {GameMap} from '../Src/Map';
import {TileData} from '../Src/Map/TileData';
import {MapGenerator} from '../Src/Map/MapGenerator';
import {Biome} from '../Src/Map/Biome';
import {Util} from '../Src/Util';

describe('MapGenerator', () => {
    let sut: MapGenerator;
    const biome = Biome.Forest;
    const dimension = 10;
    const seed = 666;
    const startInput = Array(Math.pow(dimension, 2)).fill(biome.baseTile);

    beforeEach(() => {
        sut = new MapGenerator(dimension, seed, biome, false, false);
    });

    test('the seed is deterministic', () => {
        const sut2 = new MapGenerator(dimension, seed, biome, false, false);

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

    describe('generateResourceList', () => {
        test('is deterministic based on the seed', () => {
            const tiles = Immutable.List<MapGenTile>(
                startInput.map((tile, index) => {
                    const isWater = tile.includes('water');
                    return new MapGenTile(
                        isWater
                            ? 'empty'
                            : Util.randomFromRatios(biome.ratios, this.seedrandom),
                        index,
                        this.dimension,
                        isWater
                    );
                })
            );

            const resourceList = sut['generateResourceList'](tiles);
            const resourceList2 = sut['generateResourceList'](tiles);

            expect(resourceList).toEqual(resourceList2);
        });
    });
});