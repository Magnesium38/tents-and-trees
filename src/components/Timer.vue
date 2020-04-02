<template>
	<div>
		{{ minutes }}:{{ seconds }}
	</div>
</template>

<script>
	let interval = null

	export default {
		beforeDestroy() {
			clearInterval(interval)
		},

		computed: {
			minutes() {
				return Math.floor((this.now - this.start) / 60000).toLocaleString('en', { minimumIntegerDigits: 2 })
			},

			seconds() {
				return (Math.floor((this.now - this.start) / 1000) % 60).toLocaleString('en', { minimumIntegerDigits: 2 })
			},
		},

		data() {
			return {
				start: new Date(),
				now: new Date(),
			}
		},

		mounted() {
			if (this.running) {
				interval = setInterval(() => {
					this.now = new Date()
				}, 1000)
			}
		},

		props: {
			running: {
				required: true,
				type: Boolean,
			},
		},

		watch: {
			running() {
				if (this.running) {
					interval = setInterval(() => {
						this.now = new Date()
					}, 1000)
				} else {
					clearInterval(interval)
				}
			},
		},
	}
</script>
