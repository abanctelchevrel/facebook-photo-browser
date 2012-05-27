
jQuery(function($){
    window.Album = Backbone.Model.extend({
        defaults: {
            id: undefined,
            from: undefined,
            name: undefined,
            link: undefined,
            cover_photo: undefined,
            privacy: undefined,
            count: undefined,
            type: undefined,
            created_time: undefined,
            updated_time: undefined,
            can_upload: undefined,
        },

        initialize: function(obj){
            this.set(obj);
        }
    });

    window.Albums = Backbone.Collection.extend({
        model: Album
    });
    window.albums = new Albums;

    window.AlbumView = Backbone.View.extend({
        template: _.template($("#album-template").html()),

        tagName:  "li",

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            // $(this.el).text("Album");
            return this;
        }
      });

    window.AppView = Backbone.View.extend({
        el: $("#photobrowser-app"),

        initialize: function(){
            _.bindAll(this, 'render', 'addAll', 'addOne');
            albums.bind('add', this.addOne);
            albums.bind('reset', this.addAll);
            albums.reset(window.albumsData);
            this.render();
        },
        render: function() {
            $(this.el).html("Facebook Photo Browser");
            return this;
        },
        addAll: function(){
            albums.each(this.addOne);
        },
        addOne: function(album){
            var view = new AlbumView({model: album});
            $("#album-list").append(view.render().el);
        }
    });

    
});