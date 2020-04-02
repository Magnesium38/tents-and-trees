<template>
	<div class="font-sans antialiased leading-normal tracking-normal flex flex-col min-h-screen">
		<header class="z-50 bg-purple-600 py-2 w-full fixed top-0 flex-shrink-0">
			<div class="mx-auto px-8 max-w-xl flex justify-between text-white font-medium text-2xl">
				<p class="text-center mx-auto" v-if="state === null">Create a Tents Puzzle</p>
				<timer class="mx-auto" v-else :running="timerRunning"/>
			</div>
		</header>
		<main class="container mx-auto flex-grow">
			<div class="h-full px-16 pt-32 pb-16 h-screen">
				<grid @complete="timerRunning = false" v-if="state !== null" :puzzle="state"/>

				<div v-else-if="!sizeChosen" class="flex flex-col justify-center h-full">
					<div class="flex-shrink-0 flex justify-center text-center">
						<div class="mx-8">
							<label class="block text-xs font-semibold uppercase">Height</label>
							<div class="flex">
								<button @click="height > 1 && height--" class="bg-purple-700 text-white px-2 border border-purple-700 rounded-l-md">
									<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="rounded">
										<line y1="12" y2="12" x1="4" x2="20"/>
									</svg>
								</button>
								<input type="number" min="1" step="1" class="text-center border-t border-b border-white border-purple-700 w-16 text-2xl" v-model.number="height">
								<button @click="height++" class="bg-purple-700 text-white px-2 border border-purple-700 rounded-r-md">
									<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="rounded">
										<line x1="12" x2="12" y1="4" y2="20"/>
										<line y1="12" y2="12" x1="4" x2="20"/>
									</svg>
								</button>
							</div>
						</div>
						<div class="mx-8">
							<label class="block text-xs font-semibold uppercase">Width</label>
							<div class="flex">
								<button @click="width > 1 && width--" class="bg-purple-700 text-white px-2 border border-purple-700 rounded-l-md">
									<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="rounded">
										<line y1="12" y2="12" x1="4" x2="20"/>
									</svg>
								</button>
								<input type="number" min="1" step="1" class="text-center border-t border-b border-white border-purple-700 w-16 text-2xl" v-model.number="width">
								<button @click="width++" class="bg-purple-700 text-white px-2 border border-purple-700 rounded-r-md">
									<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="rounded">
										<line x1="12" x2="12" y1="4" y2="20"/>
										<line y1="12" y2="12" x1="4" x2="20"/>
									</svg>
								</button>
							</div>
						</div>
					</div>

					<div class="flex justify-center mt-8">
						<button @click="sizeChosen = true" class="bg-purple-700 text-white text-xl py-1 px-4 mx-2 rounded">Continue</button>
					</div>
				</div>

				<grid-creator v-else :height="height" :width="width"/>
			</div>
		</main>
	</div>
</template>

<script>
	import { decode } from '@/utils'

	import Grid from '@/components/Grid'
	import GridCreator from '@/components/GridCreator'
	import Timer from '@/components/Timer'

	export default {
		components: {
			Grid,
			GridCreator,
			Timer,
		},

		created() {
			const params = new URLSearchParams(window.location.search)

			if (params.has('puzzle')) {
				try {
					this.state = decode(params.get('puzzle'))
				} catch {
					if (window.history.replaceState) {
						window.history.replaceState('', '', window.location.href.split('?')[0])
					}
				}
			}
		},

		data() {
			return {
				timerRunning: true,
				state: null,

				sizeChosen: false,
				height: 8,
				width: 8,
			}
		}
	}
</script>

<style src="@/assets/tailwind.css"></style>
