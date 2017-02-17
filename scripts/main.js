require(["searchs", "images"],function(searchs, images){
    var model = {
        searchs: []
    };

    var controller = {
        init: function () {
            formView.init();
            searchsView.init();
        },
        getSearchs: function () {
            return model.searchs;
        },
        getImages: function () {
            return images.getImages();
        },
        doSearch: function (text) {
            var promise = searchs.doSearch(text);
            promise.then(function(searchs) {
                model.searchs = searchs;
                searchsView.render();
            }).catch(
                function(reason) {
                  console.log('Manejar promesa rechazada ('+reason+') aquí.');
              });
        },
        renderViews: function () {
            formView.render();
        }
    };

    var formView = {
        init: function () {
            this.btnSearch = document.getElementById("btnSearch");
            this.textSearch = document.getElementById("textSearch");      
            var clickSearch = function(event) {
                controller.doSearch(document.getElementById("textSearch").value);
            };
            this.btnSearch.addEventListener('click', clickSearch);                
        },
        render: function () {
            this.textSearch.val("");
        }
    };

    var searchsView = {
        init: function(){
            this.divSearchs = document.getElementById("divSearchs");
            this.divSearchs.style.display = "none";  
        },
        render: function(){
            this.divSearchs = document.getElementById("divSearchs");
            this.divSearchs.style.display = "inline";
            this.divSearchs.innerHTML = "";
            for (var i = 0; i < controller.getSearchs().length; i++) {
                var item = controller.getSearchs()[i];
                document.getElementById("divSearchs").innerHTML += "<br>" + item.htmlTitle;
              }
        }
    };
    controller.init();
});