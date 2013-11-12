define(['jquery', 'underscore', 'backbone', 'common',
		'collections/todos', 'views/todo', 'text!templates/stats.html'],
function($, _, Backbone, Common, Todos, TodoView, statsTemplate) {
	return Backbone.View.extend({
		el: "#todoapp",
		statsTemplate: _.template(statsTemplate),
		events: {
			"keypress #new-todo": "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		initialize: function() {
			this.allCheckbox = this.$("#toggle-all")[0];
			this.$input = this.$("#new-todo");
			this.$footer = this.$("#footer");
			this.$main = this.$("#main");

			this.listenTo(Todos, "add", this.addOne);
			this.listenTo(Todos, "reset", this.addAll);
			this.listenTo(Todos, "change:cpmleted", this.filterOne);
			this.listenTo(Todos, "filter", this.filterAll);
			this.listenTo(Todos, "all", this.render);

			Todos.fetch();
		},

		render: function() {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;

			if (Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));
				
				this.$("#filter li a")
					.removeClass("selected")
					.filter("[href='#/" + (Common.TodoFilter || "") + "']")
					.addClass("selected");
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		addOne: function(todo) {
			var view = new TodoView({ model: todo });
			$("#todo-list").append(view.render().el);
		},

		addAll: function() {
			this.$("#todo-list").html("");
			Todos.each(this.addOne, this);
		},

		filterOne: function(todo) {
			todo.trigger("visible");
		},

		filterAll: function() {
			Todos.each(this.filterOne, this);
		},

		newAttributes: function() {
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			}
		},

		createOnEnter: function() {
			if (event.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			Todos.create(this.newAttributes());
			this.$input.val("");
		},

		clearCompleted: function() {
			_.invoke(Todos.completed(), "destroy");
			return false;
		},

		toggleAllComplete: function() {
			var completed = this.allCheckbox.checked;

			Todos.each(function(todo) {
				todo.save({
					"completed": completed
				});
			});
		}
	});
});
