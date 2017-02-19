require(['Search', 'Utilities'], function(Search, Utilities) {
    var searchs = new Search();
    var images = new Search(true);
    var currentSearchText = '';

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
        getFormattedTotalImages: function() {
            return images.getFormattedTotalSearchs();
        },
        getFormattedTotalSearchs: function() {
            return searchs.getFormattedTotalSearchs();
        },
        hasNextSearchs: function() {
            return searchs.hasNext();
        },
        hasPreviousSearchs: function() {
            return searchs.hasPrevious();
        },
        hasNextImages: function() {
            return images.hasNext();
        },
        hasPreviousImages: function() {
            return images.hasPrevious();
        },
        getCurrentSearchText: function() {
            return currentSearchText;
        },
        getCurrentPageSearch: function() {
            return searchs.getCurrentPage();
        },
        getCurrentPageImages: function() {
            return images.getCurrentPage();
        },
        getErrorImages: function() {
            return images.getError();
        },
        getErrorSearch: function() {
            return images.getError();
        },
        restartSearch: function() {
            searchs.restartResults();
            images.restartResults();
        },
        doSearch: function(text, doImages, doSearchs) {
            currentSearchText = text;
            var promiseImages = doImages ? images.doSearch(text) : undefined;
            var promiseSearch = doSearchs ? searchs.doSearch(text) : undefined;
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                    imagesView.renderPagination();
                }).catch(function(reason) {
                    imagesView.render();
                    imagesView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                    searchsView.renderPagination();
                }).catch(function(reason) {
                    searchsView.render();
                    searchsView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        previousPageImage: function() {
            var promiseImages = images.previousPage();
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                    imagesView.renderPagination();
                }).catch(function(reason) {
                    imagesView.render();
                    imagesView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        previousPageSearch: function() {
            var promiseSearch = searchs.previousPage();
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                    searchsView.renderPagination();
                }).catch(function(reason) {
                    searchsView.render();
                    searchsView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        nextPageImage: function() {
            var promiseImages = images.nextPage();
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                    imagesView.renderPagination();
                }).catch(function(reason) {
                    imagesView.render();
                    imagesView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        nextPageSearch: function() {
            var promiseSearch = searchs.nextPage();
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                    searchsView.renderPagination();
                }).catch(function(reason) {
                    searchsView.render();
                    searchsView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        goToPageImages: function(page) {
            var promiseImages = images.goToPage(page);
            if (promiseImages) {
                promiseImages.then(function(response) {
                    imagesView.render();
                    imagesView.renderPagination();
                }).catch(function(reason) {
                    imagesView.render();
                    imagesView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        },
        goToPageSearchs: function(page) {
            var promiseSearch = searchs.goToPage(page);
            if (promiseSearch) {
                promiseSearch.then(function(response) {
                    searchsView.render();
                    searchsView.renderPagination();
                }).catch(function(reason) {
                    searchsView.render();
                    searchsView.renderPagination();
                    console.log('Promise rejected (' + reason + ').');
                });
            }
        }
    };

    var formView = {
        init: function() {
            var self = this;
            self.content = document.getElementById("content");
            self.btnSearch = document.getElementById("btnSearch");
            self.textSearch = document.getElementById("textSearch");
            self.content.style.display = "none";
            var clickSearch = function(event) {
                controller.restartSearch();
                self.content.style.display = "block";
                controller.doSearch(self.textSearch.value, true, true);
            };
            self.btnSearch.addEventListener('click', clickSearch);
            var keyPressSearch = function(event) {
                self.content.style.display = "block";
                var keyCode = event.which;
                if (keyCode == 13) {
                    controller.restartSearch();
                    controller.doSearch(self.textSearch.value, true, true);
                }
            };
            self.textSearch.addEventListener('keypress', keyPressSearch);
        },
        render: function() {
            self.textSearch.val("");
        }
    };

    var searchsView = {
        init: function() {
            this.sectionSearchs = document.getElementById("sectionSearchs");
            this.paginationSearchs = document.getElementById("paginationSearchs");
            this.totalResults = document.getElementById("totalResults");
            this.searchList = document.getElementById("searchList");
            this.errorSearch = document.getElementById("errorSearch");
            this.sectionSearchs.style.display = "none";
            this.totalResults.innerHTML = "";
            this.clickPrevious = function(event) {
                controller.previousPageSearch();
            };
            this.clickNext = function(event) {
                controller.nextPageSearch();
            };
        },
        render: function() {
            this.sectionSearchs.style.display = "block";
            this.searchList.innerHTML = "";
            this.totalResults.innerHTML = "";
            this.errorSearch.innerHTML = "";
            if (controller.getErrorSearch() !== "") {
                this.searchList.style.display = "none";
                this.errorSearch.style.display = "block";
                this.errorSearch.innerHTML = controller.getErrorSearch();
            } else {
                this.errorSearch.style.display = "none";
                this.searchList.style.display = "block";
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
                this.totalResults.innerHTML = 'Total results: ' + controller.getFormattedTotalSearchs();
            }
        },
        renderPagination: function() {
            this.paginationSearchs.innerHTML = '';
            if (controller.getErrorSearch() !== "") {
                this.paginationSearchs.style.display = "none";
            } else {
                this.paginationSearchs.style.display = "inline-block";
                this.paginationSearchs.appendChild(Utilities.CreateButton("<", !controller.hasPreviousSearchs(), this.clickPrevious));
                var inputPage = document.createElement('input');
                inputPage.type = 'text';
                inputPage.value = controller.getCurrentPageSearch();
                var pageKeyPress = function(event) {
                    var newPage = Utilities.TryParseInt(inputPage.value, controller.getCurrentPageSearch());
                    var keyCode = event.which;
                    if (keyCode == 13 && newPage > 0) {
                        controller.goToPageSearchs(newPage);
                    }
                };
                inputPage.addEventListener('keypress', pageKeyPress);
                this.paginationSearchs.appendChild(inputPage);
                this.paginationSearchs.appendChild(Utilities.CreateButton(">", !controller.hasNextSearchs(), this.clickNext));
            }
        }
    };

    var imagesView = {
        init: function() {
            this.sectionImages = document.getElementById("sectionImages");
            this.paginationImages = document.getElementById("paginationImages");
            this.totalImages = document.getElementById("totalImages");
            this.imagesList = document.getElementById("imagesList");
            this.errorImages = document.getElementById("errorImages");
            this.sectionImages.style.display = "none";
            this.totalImages.innerHTML = "";
            this.clickPrevious = function(event) {
                controller.previousPageImage();
            };
            this.clickNext = function(event) {
                controller.nextPageImage();
            };
        },
        render: function() {
            this.sectionImages.style.display = "block";
            this.imagesList.innerHTML = "";
            this.totalImages.innerHTML = "";
            this.errorImages.innerHTML = "";
            if (controller.getErrorImages() !== "") {
                this.imagesList.style.display = "none";
                this.errorImages.style.display = "block";
                this.errorImages.innerHTML = controller.getErrorImages();
            } else {
                this.errorImages.style.display = "none";
                this.imagesList.style.display = "block";
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
                this.totalImages.innerHTML = 'Total results: ' + controller.getFormattedTotalImages();
            }
        },
        renderPagination: function() {
            this.paginationImages.innerHTML = '';
            if (controller.getErrorSearch() !== "") {
                this.paginationImages.style.display = "none";
            } else {
                this.paginationImages.style.display = "inline-block";
                this.paginationImages.appendChild(Utilities.CreateButton("<", !controller.hasPreviousImages(), this.clickPrevious));
                var inputPage = document.createElement('input');
                inputPage.type = 'text';
                inputPage.value = controller.getCurrentPageImages();
                var pageKeyPress = function(event) {
                    var newPage = Utilities.TryParseInt(inputPage.value, controller.getCurrentPageImages());
                    var keyCode = event.which;
                    if (keyCode == 13 && newPage > 0) {
                        controller.goToPageImages(newPage);
                    }
                };
                inputPage.addEventListener('keypress', pageKeyPress);
                this.paginationImages.appendChild(inputPage);
                this.paginationImages.appendChild(Utilities.CreateButton(">", !controller.hasNextImages(), this.clickNext));
            }
        }
    };
    controller.init();
});