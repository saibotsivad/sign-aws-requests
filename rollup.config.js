const external = [ 'crypto', 'url' ]

module.exports = [
	{
		input: 'src/index-node.js',
		output: {
			file: 'dist/sign-aws-requests.js',
			format: 'cjs'
		},
		external
	},
	{
		input: 'src/index-node.js',
		output: {
			file: 'dist/sign-aws-requests.mjs',
			format: 'es'
		},
		external
	},
	{
		input: 'src/index-browser.js',
		output: {
			file: 'dist/sign-aws-requests-browser.js',
			format: 'cjs'
		}
	},
	{
		input: 'src/index-browser.js',
		output: {
			file: 'dist/sign-aws-requests-browser.mjs',
			format: 'es'
		}
	}
]
