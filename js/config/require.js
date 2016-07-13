
require.config({
	baseUrl: 'js',
	urlArgs: "v=" + (new Date()).getTime(),
	paths: {
		'lodash': '../vendor/lodash.min',
		'JSClass': '../vendor/js.class/dist/browser/js.class-noconflict'
	},
	shim: {
		'JSClass': {
			'exports': 'JSClass'
		}
	}
});