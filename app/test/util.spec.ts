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
});