import {Item} from '../../../src/data/Item';
import {ItemUtil} from '../../../src/entity/util/item';

describe('ItemUtil', () => {
    let sut: ItemUtil;

    beforeEach(() => {
        sut = new ItemUtil();

        sut._getItemState = jest.fn((id: number) => {
            return {
                enum: id
            };
        });
    });

    describe('itemListToString', () => {
        [{
            input: [Item.Wood],
            output: 'wood (1)'
        }, {
            input: [Item.Wood, Item.Wood, Item.Wood],
            output: 'wood (3)'
        }, {
            input: [Item.Wood, Item.Berries, Item.Berries],
            output: 'wood (1) berries (2)'
        }].forEach(({input, output}) => {
            test('returns a string presenting the items in the list', () => {
                const actualOutput = sut.itemListToString(input);

                expect(actualOutput).toBe(output);
            });
        });
    });
});