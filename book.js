define([
    "namespace",
    "use!backbone"
]),

function (namespace, Backbone) {
    var Book = namespace.module();

    Book.Router = Backbone.Router.extend({
        routes: {
            "book/:p" : "details"
        },

        details: function (hash) {
            var view = new Book.Views.Details({model: Library.get(hash)});
            view.render (function(el) {
                $("main").html(el);
            });
        }
    });

    var router = new Book.Router();

    Book.Model = Backbone.Model.extend();
    Book.Collection = Backnone.Conllection.extend({
        model: Book.Model
        });
}