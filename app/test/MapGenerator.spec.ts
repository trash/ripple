import * as Immutable from 'immutable';
import {MapGenTile} from '../Src/Map/MapGenTile';
import {GameMap} from '../Src/Map';
import {TileData} from '../Src/Map/TileData';
import {MapGenerator} from '../Src/Map/MapGenerator';
import {Biome} from '../Src/Map/Biome';
import {Util} from '../Src/Util';
import {Resource} from '../Src/Data/Resource';

describe('MapGenerator', () => {
    let sut: MapGenerator;
    let sut2: MapGenerator;
    const biome = Biome.Forest;
    const dimension = 10;
    const seed = 666;
    const startInput = Array(Math.pow(dimension, 2)).fill(biome.baseTile);

    function getResourceList(size: number): Immutable.List<Resource> {
        return Immutable.List<Resource>(new Array(size).fill(null));;
    }

    beforeEach(() => {
        sut = new MapGenerator(dimension, seed, biome, false, false);
        sut2 = new MapGenerator(dimension, seed, biome, false, false);
    });

    describe('the seed is deterministic', () => {
        test('the seed is the same', () => {
            expect(sut['seed']).toEqual(sut2['seed']);
        });

        test('it produces the same numbers', () => {
            for (let i = 0; i < 3; i++) {
                expect(sut['seedrandom']()).toEqual(sut2['seedrandom']());
            }
        });

        test('it generates the same output', () => {
            const sut2 = new MapGenerator(dimension, seed, biome, false, false);

            const output = sut.generate(true);
            const output2 = sut2.generate(true);

            expect(output).toEqual(output2);
        });
    });

    describe('generateWater', () => {
        test('it is deterministic based on the seed', () => {
            const output = sut.generateWater(startInput);
            const output2 = sut2.generateWater(startInput);

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
            const output2 = sut2.normalizeWaterTiles(input);

            expect(output).toEqual(output2);
        });
    });

    describe('generateInitialMapGenTiles', () => {
        test('is deterministic based on the seed', () => {
            const tiles = sut['generateInitialMapGenTiles'](startInput);
            const tiles2 = sut2['generateInitialMapGenTiles'](startInput);

            expect(tiles).toEqual(tiles2);
        });
    });

    describe('generateResourceList', () => {
        test('is deterministic based on the seed', () => {
            const tiles = sut['generateInitialMapGenTiles'](startInput);
            const tiles2 = sut2['generateInitialMapGenTiles'](startInput);

            const resourceList = sut['generateResourceList'](tiles);
            const resourceList2 = sut2['generateResourceList'](tiles2);

            expect(resourceList).toEqual(resourceList2);
        });
    });

    describe('generateHills', () => {
        test('is deterministic based on the seed', () => {
            const tiles = sut['generateInitialMapGenTiles'](startInput);
            const inputResourceList = getResourceList(startInput.length);

            const resourceList = sut['generateHills'](tiles, inputResourceList);
            const resourceList2 = sut2['generateHills'](tiles, inputResourceList);

            expect(resourceList).toEqual(resourceList2);
        });
    });

    describe('generateResources', () => {
        test('is deterministic based on the seed', () => {
            const tiles = sut['generateInitialMapGenTiles'](startInput);
            const tiles2 = sut2['generateInitialMapGenTiles'](startInput);
            const inputResourceList = getResourceList(startInput.length);
            const inputResourceList2 = getResourceList(startInput.length);

            const resourceList = sut['generateResources'](tiles, inputResourceList);
            const resourceList2 = sut2['generateResources'](tiles2, inputResourceList2);

            expect(resourceList).toEqual(resourceList2);
        });
    });
});