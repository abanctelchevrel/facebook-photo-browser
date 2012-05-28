
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

        url: function(){
            return '/' + this.get('id');
        },
        sync: function(method, model, options){
            switch (method) {
                case "read":    resp = this.find(model, options); break;
            }
        },
        initialize: function(obj){
            this.set(obj);
        },
        find: function(model, options) {
            return FB.api(this.url(), function(response){
                log(response)
                log(options)
                if (!response || response.error) {
                    options.error('FB api error : ' + response.error);
                } else {
                    options.success(response);
                }
            });
        }
    });
    window.Photos = Backbone.Collection.extend({
        model: Photo,
        url: function(){
            return '/' + this.albumId + '/photos';
        },
        initialize: function(model, options){
            this.albumId = options.albumId;
        },
        sync: function(method, model, options){
            switch (method) {
                case "read":    resp = this.findAll(model, options); break;
            }
        },
        findAll: function(model, options) {
            return FB.api(this.url(), function(response){
                if (!response || response.error) {
                    options.error('FB api error : ' + response.error);
                } else {
                    options.success(response.data);
                }
            });
        }
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
        url: '/album',
        initialize: function(obj){
            this.set(obj);
            this.photos = new Photos([], {albumId: this.get("id")});
            this.coverPhoto = new Photo({id: this.get("cover_photo")});
            this.coverPhoto.fetch();
        }
    });

    window.Albums = Backbone.Collection.extend({
        model: Album,
        url: '/me/albums',
        sync: function(method, model, options){
            switch (method) {
                case "read":    resp = this.findAll(model, options); break;
            }
        },
        findAll: function(model, options) {
            return FB.api(this.url, function(response){
                if (!response || response.error) {
                    options.error('FB api error : ' + response.error);
                } else {
                    options.success(response.data);
                }
            });
        }
    });

    window.albums = new Albums;

    window.AlbumView = Backbone.View.extend({
        template: _.template($("#album-template").html()),

        tagName:  "li",
        events: {
            "click" : "open"
        },
        initialize: function() {
            _.bindAll(this, 'render', 'open', 'addAll', 'addOne', 'renderThumbnail');
            this.model.photos.bind('reset', this.addAll);
            this.model.coverPhoto.bind('change', this.renderThumbnail);
        },

        open: function(data){
            this.model.photos.fetch();
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        renderThumbnail: function() {
            log('renderThumbnail')
            log(this.model.coverPhoto.get('picture'))
            $(this.el).find('.album-thumbnail').attr("src", this.model.coverPhoto.get('picture'));
            return this;
        },

        addAll: function(){
            this.model.photos.each(this.addOne);
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
            albums.fetch()
            this.render();
        },
        render: function() {
            $(this.el).removeClass("loading")
            // $(this.el).html("Facebook Photo Browser");
            return this;
        },
        addAll: function(){
            $("#album-list").empty();
            albums.each(this.addOne);
        },
        addOne: function(album){
            var view = new AlbumView({model: album});
            $("#album-list").append(view.render().el);
        }
    });

    
});