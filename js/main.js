require.config({
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalStorage: {
			deps: ['backbone'],
			exports: 'Store'
		}
	},
	paths: {
		jquery: '../bower_components/jquery/jquery',
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		text: '../bower_components/requirejs-text/text'
	}
});

require(['backbone', 'views/app', 'routers/router'],
function (Backbone, AppView, Workspace) {
	new Workspace();
	Backbone.history.start();

	new AppView();
});
