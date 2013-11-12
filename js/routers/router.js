define(['backbone', 'common', 'collections/todos'],
function(Backbone, Common, Todos) {
	return Backbone.Router.extend({
		routes: {
			"*filter": "setFilter"
		},

		setFilter: function(param) {
			Common.TodoFilter = param || "";
			Todos.trigger("filter");
		}
	});
});
