require(["genericSearch", "searchs", "images", "GoogleCustomSearch"], function(genericSearch, searchs, images, GoogleCustomSearch) {

    var controller = {
        init: function() {
            formView.init();
            searchsView.init();
            imagesView.init();
        },
        getSearchs: function() {
            return searchs.getResults();
        },
        getImages: function() {
            return images.getResults();
        },
        getTotalImages: function() {
            return images.getTotalSearchs();
        },
        getTotalSearchs: function() {
            return searchs.getTotalSearchs();
        },
        doSearch: function(text) {
            var promiseImages = images.doSearch(text);
            var promiseSearch = searchs.doSearch(text);
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                }).catch(function(reason) {
                    imagesView.render();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                }).catch(function(reason) {
                    searchsView.render();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        previousPageImage: function() {
            var promiseImages = images.previousPage();
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                }).catch(function(reason) {
                    imagesView.render();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        previousPageSearch: function() {
            var promiseSearch = searchs.previousPage();
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                }).catch(function(reason) {
                    searchsView.render();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        nextPageImage: function() {
            var promiseImages = images.nextPage();
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                }).catch(function(reason) {
                    imagesView.render();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        nextPageSearch: function() {
            var promiseSearch = searchs.nextPage();
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                }).catch(function(reason) {
                    searchsView.render();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        renderViews: function() {
            formView.render();
        }
    };

    var formView = {
        init: function() {
            this.btnSearch = document.getElementById("btnSearch");
            this.textSearch = document.getElementById("textSearch");
            var clickSearch = function(event) {
                controller.doSearch(document.getElementById("textSearch").value);
            };
            this.btnSearch.addEventListener('click', clickSearch);
        },
        render: function() {
            this.textSearch.val("");
        }
    };

    var searchsView = {
        init: function() {
            this.sectionSearchs = document.getElementById("sectionSearchs");
            this.totalResults = document.getElementById("totalResults");
            this.btnPrevious = document.getElementById("btnPreviousSearch");
            this.btnNext = document.getElementById("btnNextSearch");
            this.searchList = document.getElementById("searchList");
            this.sectionSearchs.style.display = "none";
            this.totalResults.innerHTML = "";
            var clickPrevious = function(event) {
                controller.previousPageSearch();
            };
            var clickNext = function(event) {
                controller.nextPageSearch();
            };
            this.btnPrevious.addEventListener('click', clickPrevious);
            this.btnNext.addEventListener('click', clickNext);
        },
        render: function() {
            this.sectionSearchs.style.display = "block";
            this.searchList.innerHTML = "";
            this.totalResults.innerHTML = "";
            controller.getSearchs().forEach(function(item) {
                var template = document.getElementById('searchItem').innerHTML;
                var el = document.createElement('li');
                el.innerHTML = template;
                el.className = 'search-item';
                var link = el.getElementsByClassName("search-link")[0];
                link.innerHTML = item.htmlTitle;
                link.href = item.link;
                var description = el.getElementsByClassName("search-desc")[0];
                description.innerHTML = item.htmlSnippet;
                this.searchList.appendChild(el);
            });
            this.totalResults.innerHTML = controller.getTotalSearchs();
        }
    };

    var imagesView = {
        init: function() {
            this.sectionImages = document.getElementById("sectionImages");
            this.totalImages = document.getElementById("totalImages");
            this.btnPrevious = document.getElementById("btnPreviousImage");
            this.btnNext = document.getElementById("btnNextImage");
            this.imagesList = document.getElementById("imagesList");
            this.sectionImages.style.display = "none";
            this.totalImages.innerHTML = "";
            var clickPrevious = function(event) {
                controller.previousPageImage();
            };
            var clickNext = function(event) {
                controller.nextPageImage();
            };
            this.btnPrevious.addEventListener('click', clickPrevious);
            this.btnNext.addEventListener('click', clickNext);
        },
        render: function() {
            this.sectionImages.style.display = "block";
            this.imagesList.innerHTML = "";
            this.totalImages.innerHTML = "";
            controller.getImages().forEach(function(item) {
                var template = document.getElementById('imageItem').innerHTML;
                var el = document.createElement('li');
                el.innerHTML = template;
                el.className = 'image-item';
                var link = el.getElementsByClassName("image-link")[0];
                link.href = item.link;
                var image = el.getElementsByClassName("image-img")[0];
                image.innerHTML = item.htmlTitle;
                image.src = item.link;
                image.alt = item.snippet;
                this.imagesList.appendChild(el);
            });
            this.totalImages.innerHTML = controller.getTotalImages();
        }
    };
    controller.init();
});