import * as seedrandom from 'seedrandom';
import {Util} from '../src/Util';

describe('Util', () => {
    describe('getIndexInRange', () => {
        [{
            list: [0, 2, 5, 7, 10],
            value: 3,
            expectedIndex: 2
        }, {
            list: [0, 2, 5, 7, 10],
            value: 10,
            expectedIndex: 4
        }, {
            list: [0, 2, 5, 7, 10],
            value: -1,
            expectedIndex: 0
        }, {
            list: [0, 2, 5, 7, 10],
            value: 2,
            expectedIndex: 2
        }].forEach(({list, value, expectedIndex}) => {
            test('returns the correct index', () => {
                const index = Util.getIndexInRange(list, value);

                expect(index).toBe(expectedIndex);
            });
        });
    });

    describe('ratiosToChanceMap', () => {
        [{
            input: {
                a: 3,
                b: 1
            },
            output: ['a', 'a', 'a', 'b']
        }, {
            input: {
                a: 3,
                b: 3
            },
            output: ['a', 'a', 'a', 'b', 'b', 'b']
        }].forEach(({input, output}) => {
            expect(Util.ratiosToChanceMap(input)).toEqual(output);
        });
    });

    describe('randomFromRatios', () => {
        test('returns predictable values with a seed', () => {
            const random = seedrandom('test');
            const random2 = seedrandom('test');
            const ratiosMap = {
                a: 1,
                b: 3
            };

            for (let i = 0; i < 3; i++) {
                const result = Util.randomFromRatios(ratiosMap, random);
                const result2 = Util.randomFromRatios(ratiosMap, random2);
                expect(result).toEqual(result2);
            }
        });
    });
});