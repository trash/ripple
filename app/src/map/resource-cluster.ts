import {util} from '../util';
import {Tile} from '../map/tile';

/**
 * Generates a resource cluster of a given resource.
 * Spirals outward from the given tile
 *
 * @param {String} type The type of resource to generate i.e. 'tree', 'rock'
 * @param {Number} size The total number of tiles to encompass
 * @param {Tile} tile The tile to start the search from
 */
export class ResourceCluster {
	constructor (type: string, size: number, tile: Tile) {
		// Hack to make sure trees aren't being spawned on water
		if (size === 1 && !util.validTiles.resource([tile]).length) {
			return;
		}

		let map = tile.map;

		const tiles: Tile[] = [tile];

		// Do the first tile
		tile.resource = type;

		for (var i=0; i < size-1; i++) {
			// Give me the next closest tile without a resource and without water
			var nextTile = map.getNearestEmptyTile(tile, checkTile => {
				return !checkTile.resource && util.validTiles.resource([checkTile]).length;
			});
			// No more free tiles?
			if (!nextTile) {
				break;
			}

			nextTile.resource = type;

			tiles.push(nextTile);
		}
		this.clearTiles(tiles);
	}
	clearTiles (tiles: Tile[]) {
		// Clear the stuff underneath the resources
		tiles.forEach(tile => {
			// Don't touch water tiles
			if (tile.tilemapData.indexOf('water') !== -1) {
				return;
			}
			tile.tilemapData = 'empty';
		});
	};
};