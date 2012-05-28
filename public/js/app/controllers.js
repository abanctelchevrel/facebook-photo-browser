
jQuery(function($){
    window.Photo = Backbone.Model.extend({
        defaults: {
            id: undefined,
            from: undefined,
            picture: undefined,
            source: undefined,
            height: undefined,
            width: undefined,
            images: undefined,
            link: undefined,
            icon: undefined,
            created_time: undefined,
            position: undefined,
            updated_time: undefined,
            comments: undefined,
            likes: undefined 
        },

        initialize: function(obj){
            this.set(obj);
        }
    });
    window.Photos = Backbone.Collection.extend({
        model: Photo
    });

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
        events: {
            "click" : "open"
        },
        initialize: function() {
            _.bindAll(this, 'render', 'open', 'addAll', 'addOne');
            this.photos = new Photos;
        },

        open: function(data){
            this.photos.reset(window.photosFromFacebook.data);
            log(this.photos)
            this.addAll();
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        addAll: function(){
            this.photos.each(this.addOne);
        },
        
        addOne: function(photo){
            var view = new PhotoView({model: photo});
            $("#photo-list").append(view.render().el);
        }
      });

    window.PhotoView = Backbone.View.extend({
        template: _.template($("#photo-template").html()),

        tagName:  "li",
        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
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
            $(this.el).removeClass("loading")
            // $(this.el).html("Facebook Photo Browser");
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