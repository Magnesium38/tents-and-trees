module.exports = {
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji',
				],
			}
		},
	},
	variants: {},
	plugins: [],
	purge: [
		'./public/**/*.html',
		'./src/**/*.vue',
	],
}
