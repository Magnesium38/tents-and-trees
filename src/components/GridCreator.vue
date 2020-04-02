<template>
	<div class="flex flex-col h-full">
		<section class="w-full h-full text-center flex justify-center">
			<p class="py-2 px-4 max-w-xs bg-red-700 text-red-100" v-if="height < 1 || width < 1">Height and Width must both be positive integers</p>
			<div class="w-full h-full flex flex-col" v-else>
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
							<div @click="toggle(x, y)" @contextmenu.prevent class="cell bg-white border-gray-900 relative cursor-pointer" :class="{
								'bg-green-200': [1, 2, 3].includes(cell)
							}" :key="`${x}:${y}`">
								<div class="absolute inset-0 flex flex-col justify-end items-center cursor-default" @click.stop v-if="y === 0" style="transform: translateY(-105%);">
									<div class="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 p-1">
										<input class="h-full w-full border text-center md:text-xl shadow-inner" tabindex="1" v-model="state.rowHints[x]">
									</div>
								</div>
								<div class="absolute inset-0 flex justify-end items-center cursor-default" @click.stop v-if="x === 0" style="transform: translateX(-110%);">
									<div class="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 p-1">
										<input class="h-full w-full border text-center md:text-xl shadow-inner" tabindex="2" v-model="state.columnHints[y]">
									</div>
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
								</div>
							</div>
						</template>
					</template>
				</div>
			</div>
		</section>
		<section class="mt-8 flex flex-col items-center text-center">
			<p class="block text-xs font-semibold uppercase">Sharable URL</p>
			<a :href="url" target="_blank" rel="noopener noreferrer"  class="mx-auto bg-purple-700 text-white py-2 px-4">{{ url }}</a>
		</section>
	</div>
</template>

<script>
	import { encode } from '@/utils'

	export default {
		computed: {
			url() {
				return `${window.location.host}?puzzle=${encode(this.state, this.rowHints, this.ColumnHints)}`
			}
		},

		created() {
			this.state.grid = Array.from({ length: this.height }, () => Array(this.width).fill(0))
			this.state.rowHints = Array.from({ length: this.width }, () => '')
			this.state.columnHints = Array.from({ length: this.height }, () => '')
		},

		data() {
			return {
				state: {
					grid: null,
					rowHints: [],
					columnHints: [],
				},

				cellWidth: null,
				cellHeight: null,
			}
		},

		methods: {
			toggle(x, y) {
				if (this.state.grid[y][x] === 0) {
					this.state.grid[y].splice(x, 1, 1)
				} else {
					this.state.grid[y].splice(x, 1, 0)
				}
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
			height: {
				required: true,
				type: Number,
			},

			width: {
				required: true,
				type: Number,
			},
		},
	}
</script>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		display: none;
		margin: 0;
		margin: 0;
	}

	/* Firefox */
	input[type=number] {
		-moz-appearance: textfield;
	}
</style>
