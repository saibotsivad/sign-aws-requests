module.exports = [
	{
		input: 'src/index-node.js',
		output: {
			file: 'dist/sign-aws-requests.js',
			format: 'cjs'
		}
	},
	{
		input: 'src/index-node.js',
		output: {
			file: 'dist/sign-aws-requests.mjs',
			format: 'es'
		}
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
