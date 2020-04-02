<template>
	<div class="w-full h-full flex flex-col">
		<div class="h-full mx-auto grid select-none border-4 border-gray-900" :style="`
			grid-template-columns: repeat(${width - 1}, ${cellWidth === null ? '1fr' : `${cellWidth}px` } 1px) ${cellWidth === null ? '1fr' : `${cellWidth}px` };
			grid-template-rows: repeat(${height - 1}, ${cellHeight === null ? '1fr' : `${cellHeight}px` } 1px) ${cellHeight === null ? '1fr' : `${cellHeight}px` };
			width: ${cellWidth === null ? '100%' : `${cellWidth * width + width + 7}px`};
			height: ${cellHeight === null ? '100%' : `${cellHeight * height + height + 7}px`};
		`">
			<template v-for="(row, y) in state.grid">
				<template v-for="x in row.length - 1">
					<div v-if="y !== 0" class="w-full h-px relative bg-gray-900" :key="`border-t-${x}-${y}`"></div>
					<div v-if="y !== 0" class="w-full h-px relative bg-gray-900" :key="`border-t-${x}-${y}-2`"></div>
				</template>
				<div v-if="y !== 0" class="w-full h-px relative bg-gray-900" :key="`border-t-${y}`"></div>
				<template v-for="(cell, x) in row">
					<div v-if="x !== 0" class="h-full w-px relative bg-gray-900" :key="`border-l-${x}-${y}`"></div>
					<div @click="cycleForwards(x, y)" @contextmenu.prevent="cycleBackwards(x, y)" class="cell bg-white border-gray-900 relative cursor-pointer" :class="{
						'bg-green-200': [1, 2, 3].includes(cell)
					}" :key="`${x}:${y}`">
						<div class="absolute inset-0 flex flex-col justify-end items-center cursor-default" @click.stop v-if="y === 0" style="transform: translateY(-105%);">
							<p class="p-1 leading-none md:text-xl">{{ state.rowHints[x] }}</p>
						</div>
						<div class="absolute inset-0 flex justify-end items-center cursor-default" @click.stop v-if="x === 0" style="transform: translateX(-110%);">
							<p class="p-1 leading-none md:text-xl">{{ state.columnHints[y] }}</p>
						</div>

						<div @click.stop="toggleTopEdge(x, y)" @contextmenu.stop.prevent v-if="y > 0" class="text-green-900 absolute z-10 w-full top-0 -mt-1 h-2 flex items-center justify-center">
							<svg v-if="topEdges[x][y]" fill="none" stroke="currentColor" stroke-width="1" class="z-20 h-2 w-2 md:h-3 md:w-3 relative -my-1" viewBox="0 0 6 6">
								<line x1="0" x2="6" y1="0" y2="6"/>
								<line x1="0" x2="6" y1="6" y2="0"/>
							</svg>
						</div>
						<div @click.stop="toggleLeftEdge(x, y)" @contextmenu.stop.prevent v-if="x > 0" class="text-green-900 absolute z-10 h-full left-0 -ml-1 w-2 flex items-center justify-center">
							<svg v-if="leftEdges[x][y]" fill="none" stroke="currentColor" stroke-width="1" class="z-20 h-2 w-2 md:h-3 md:w-3 relative -mx-1" viewBox="0 0 6 6">
								<line x1="0" x2="6" y1="0" y2="6"/>
								<line x1="0" x2="6" y1="6" y2="0"/>
							</svg>
						</div>

						<div class="mx-auto w-full h-full relative">
							<div v-if="cell === 1" class="absolute inset-0">
								<svg fill="none" class="w-full h-full" viewBox="0 0 48 48">
									<path class="text-orange-900" fill="currentColor" d="M20 28h8v17h-8z"/>
									<g class="text-green-600">
										<circle cx="17.5" cy="17.5" r="8.5" fill="currentColor"/>
										<circle cx="21.5" cy="26.5" r="11.5" fill="currentColor"/>
										<circle cx="26.5" cy="12.5" r="9.5" fill="currentColor"/>
										<circle cx="29.5" cy="27.5" r="9.5" fill="currentColor"/>
										<path fill="currentColor" d="M15 14h18v15H15z"/>
										<circle cx="33" cy="19" r="5" fill="currentColor"/>
									</g>
								</svg>
							</div>
							<div v-if="cell === 2" class="absolute inset-0 z-0">
								<svg fill="none" class="w-full h-full text-green-900" viewBox="0 0 48 48">
									<circle cx="24" cy="24" r="4" fill="currentColor"/>
								</svg>
							</div>
							<div v-if="cell === 3" class="absolute inset-0">
								<svg fill="none" class="w-full h-full" viewBox="0 0 48 48">
									<path class="text-purple-400" d="M41 45H7l17-33 17 33z" fill="currentColor"/>
									<path class="text-purple-900" d="M24 27l-7 18h14l-7-18z" fill="currentColor"/>
								</svg>
							</div>
						</div>
					</div>
				</template>
			</template>
		</div>

		<div class="mt-6 flex-shrink-0">
			<div class="flex justify-center">
				<button @click="stateId > 0 && stateId--" class="text-white py-1 px-4 mx-2 rounded" :class="stateId > 0 ? 'bg-purple-700' : 'bg-purple-400'">Undo</button>
				<button @click="stateId !== 0 && (stateId = 0)" class="bg-purple-700 text-white py-1 px-4 mx-2 rounded">Restart</button>
				<button @click="stateId < stateLog.length - 1 && stateId++" class="text-white py-1 px-4 mx-2 rounded" :class="stateId < stateLog.length - 1 ? 'bg-purple-700' : 'bg-purple-400'">Redo</button>
			</div>
			<div class="flex justify-center mt-4">
				<button @click="check" class="bg-purple-700 text-white py-1 px-4 mx-2 rounded">Check</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { isSolved } from '@/utils'

	export default {
		computed: {
			leftEdges() {
				return this.state.leftEdges
			},

			topEdges() {
				return this.state.topEdges
			}
		},

		created() {
			this.state = this.puzzle
			this.height = this.state.columnHints.length
			this.width = this.state.rowHints.length

			this.state.leftEdges = Array.from({ length: this.height }, () => Array(this.width).fill(false))
			this.state.topEdges = Array.from({ length: this.width }, () => Array(this.width).fill(false))

			this.pushState()
		},

		data() {
			return {
				width: 0,
				height: 0,
				state: null,

				stateLog: [],
				stateId: -1,

				cellWidth: null,
				cellHeight: null,
			}
		},

		methods: {
			check() {
				if (isSolved(this.state)) {
					this.$emit('complete')

					window.alert('Looks good to me!')
				} else {
					window.alert(`That doesn't look right!`)
				}
			},

			cycleBackwards(x, y) {
				let value = 1

				switch (this.state.grid[y][x]) {
					case 0:
						value = 3
						break
					case 2:
						value = 0
						break
					case 3:
						value = 2
						break
					default:
						return
				}

				this.state.grid[y].splice(x, 1, value)

				this.pushState()
			},

			cycleForwards(x, y) {
				let value = 1

				switch (this.state.grid[y][x]) {
					case 0:
						value = 2
						break
					case 2:
						value = 3
						break
					case 3:
						value = 0
						break
					default:
						return
				}

				this.state.grid[y].splice(x, 1, value)

				this.pushState()
			},

			pushState() {
				this.stateId++

				this.stateLog.splice(this.stateId, this.stateLog.length, JSON.parse(JSON.stringify(this.state)))
			},

			toggleLeftEdge(x, y) {
				if (this.leftEdges[x][y]) {
					this.leftEdges[x].splice(y, 1, false)
				} else {
					this.leftEdges[x].splice(y, 1, true)
				}

				this.pushState()
			},

			toggleTopEdge(x, y) {
				if (this.topEdges[x][y]) {
					this.topEdges[x].splice(y, 1, false)
				} else {
					this.topEdges[x].splice(y, 1, true)
				}

				this.pushState()
			},
		},

		mounted() {
			const cell = this.$el.getElementsByClassName('cell')[0]
			this.cellWidth = cell.offsetWidth
			this.cellHeight = cell.offsetHeight

			if (this.cellWidth > this.cellHeight) {
				this.cellWidth = this.cellHeight
			} else {
				this.cellHeight = this.cellWidth
			}
		},

		props: {
			puzzle: {
				required: true,
				type: Object,
			},
		},

		watch: {
			stateId() {
				this.state = JSON.parse(JSON.stringify(this.stateLog[this.stateId]))
			},
		},
	}

	/**
	 * 
	 * Check
	 * 		:(
	 * 
	 */
</script>
