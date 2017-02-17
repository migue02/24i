require(["searchs", "images"],function(searchs, images){

    var controller = {
        init: function () {
            formView.init();
        },
        getSearchs: function () {
            return searchs.getSearchs();
        },
        getImages: function () {
            return images.getImages();
        },
        doSearch: function (text) {
            var promise = searchs.doSearch(text);
            promise.then(
                function(searchs) {
                  console.log(searchs);
              })
            .catch(
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
    controller.init();
});