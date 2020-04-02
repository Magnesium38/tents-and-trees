import lzstring from 'lz-string'

export function encode(state) {
	const grid = state.grid.map(column => {
		return column.join('')
	}).join('')

	const rowHints = state.rowHints.join(':')
	const columnHints = state.columnHints.join(':')

	return lzstring.compressToEncodedURIComponent(`${rowHints};${columnHints};${grid}`)
}

export function decode(encoded) {
	const decoded = lzstring.decompressFromEncodedURIComponent(encoded)
	const state = {
		rowHints: null,
		columnHints: null,
		grid: null,
		decoded,
	}

	const parts = decoded.split(';')
	state.rowHints = parts[0].split(':')
	state.columnHints = parts[1].split(':')

	const cells = parts[2].split('').map(n => parseInt(n))

	const chunk = (arr, size) => {
		return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => {
			return arr.slice(i * size, i * size + size)
		})
	}

	state.grid = chunk(cells, state.columnHints.length)


	return state
}

export function isSolved({ grid }) {
	const treeLocations = grid.reduce((locations, row, y) => {
		return [...locations, ...row.reduce((locations, cell, x) => {
			return [
				...locations,
				...cell === 1 ? [{ x, y }] : [],
			]
		}, [])]
	}, [])
	const tentLocations = grid.reduce((locations, row, y) => {
		return [...locations, ...row.reduce((locations, cell, x) => {
			return [
				...locations,
				...cell === 3 ? [{ x, y }] : [],
			]
		}, [])]
	}, [])

	// Trees and Tents counts must be equal
	if (tentLocations.length !== treeLocations.length) {
		return false
	}

	// Tents can't be next to each other
	for (const [i, { x: x1, y: y1 }] of tentLocations.slice(0, tentLocations.length - 1).entries()) {
		for (const { x: x2, y: y2 } of tentLocations.slice(i + 1)) {
			if (Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) < 4) {
				return false
			}
		}
	}

	const claimedTrees = new Map()
	const tentsWithPotentialTrees = tentLocations.map(tent => {
		return {
			tent,
			trees: treeLocations.filter(tree => {
				if (Math.pow(tent.x - tree.x, 2) + Math.pow(tent.y - tree.y, 2) < 2) {
					claimedTrees.set(tree, false)
					return true
				}

				return false
			}),
		}
	})

	// Trees must have at least one tent
	if (claimedTrees.size !== treeLocations.length) {
		return false
	}

	// Tents must be orthoganal to at least one tree
	if (tentsWithPotentialTrees.some(({ trees }) => trees.length === 0)) {
		return false
	}

	// Trees can only belong to one tent
	return resolveClaims(tentsWithPotentialTrees, claimedTrees)
}

function resolveClaims(tentsWithPotentialTrees, unclaimedTrees) {
	const sorted = tentsWithPotentialTrees.slice().sort(({ trees: a }, { trees: b }) => a.length - b.length)
	const map = new Map(unclaimedTrees)

	
	const unresolved = []
	for (const { tent, trees } of sorted) {
		const unclaimed = trees.filter(tree => !map.get(tree))

		if (unclaimed.length === 1) {
			map.set(unclaimed[0], true)
		} else if (unclaimed.length === 0) {
			return false
		} else {
			unresolved.push({
				tent,
				trees: unclaimed,
			})
		}
	}

	// Check if need to attempt resolving
	if (unresolved.length === 0) {
		return true
	} else if (unresolved.length !== tentsWithPotentialTrees.length) {
		// We resolved something. Try again
		return resolveClaims(unresolved, map)
	} else {
		// Make an assumption on a claim and follow it through
		const assumption = unresolved.pop()
		for (const tree of assumption.trees) {
			const clonedMap = new Map(map)
			clonedMap.set(tree, true)

			if (resolveClaims(unresolved, clonedMap)) {
				return true
			}
		}
	}

	return false
}
