export const Biome = {
    Forest: {
		name: 'forest',
		baseTile: 'full-grass',
		// full-grass: background
		// 1: background
		// grass: grass
		// 3: grass rock top right
		// grass3: grass rock top left
		// 5: grass multiple rocks
		// 6: grass multiple rocks 2
		// grass6: grass with mushrooms
		// 8: dirt on grass 1
		// 9: dirt on grass 2
		// 10: dirt on grass 3
		ratios: {
			'empty': 40, //effectively 'full-grass'
			'grass': 20,
			// 'grass2': 8,
			'grass3': 2,
			// 'grass4': 2,
			// 'grass5': 2,
			'grass6': 2,
			// 'dirt1': 2

		}
	}
};