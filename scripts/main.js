require(['Search', 'Utilities'], function(Search, Utilities) {
    var searchs = new Search();
    var images = new Search(true);
    var currentSearchText = '';

    var controller = {
        init: initController,
        getSearchs: getSearchs,
        getImages: getImages,
        getFormattedTotalImages: getFormattedTotalImages,
        getFormattedTotalSearchs: getFormattedTotalSearchs,
        hasNextSearchs: hasNextSearchs,
        hasPreviousSearchs: hasPreviousSearchs,
        hasNextImages: hasNextImages,
        hasPreviousImages: hasPreviousImages,
        getCurrentSearchText: getCurrentSearchText,
        getCurrentPageSearch: getCurrentPageSearch,
        getCurrentPageImages: getCurrentPageImages,
        getErrorImages: getErrorImages,
        getErrorSearch: getErrorSearch,
        restartSearch: restartSearch,
        isSearching: isSearching,
        handleSearchPromise: handleSearchPromise,
        handleImagePromise: handleImagePromise,
        doSearch: doSearch,
        previousPageImage: previousPageImage,
        previousPageSearch: previousPageSearch,
        nextPageImage: nextPageImage,
        nextPageSearch: nextPageSearch,
        goToPageImages: goToPageImages,
        goToPageSearchs: goToPageSearchs
    };


    var formView = {
        init: initFormView,
        render: renderFormView
    };


    var searchsView = {
        init: initSearchView,
        render: renderSearchView,
        renderPagination: renderSearchPagination
    };


    var imagesView = {
        init: initImageView,
        render: renderImageView,
        renderPagination: renderImagePagination
    };

    controller.init();

    ///////////////////////////////////////
    // Controller functions ///////////////
    ///////////////////////////////////////

    function initController() {
        formView.init();
        searchsView.init();
        imagesView.init();
    }

    function getSearchs() {
        return searchs.getResults();
    }

    function getImages() {
        return images.getResults();
    }

    function getFormattedTotalImages() {
        return images.getFormattedTotalSearchs();
    }

    function getFormattedTotalSearchs() {
        return searchs.getFormattedTotalSearchs();
    }

    function hasNextSearchs() {
        return searchs.hasNext();
    }

    function hasPreviousSearchs() {
        return searchs.hasPrevious();
    }

    function hasNextImages() {
        return images.hasNext();
    }

    function hasPreviousImages() {
        return images.hasPrevious();
    }

    function getCurrentSearchText() {
        return currentSearchText;
    }

    function getCurrentPageSearch() {
        return searchs.getCurrentPage();
    }

    function getCurrentPageImages() {
        return images.getCurrentPage();
    }

    function getErrorImages() {
        return images.getError();
    }

    function getErrorSearch() {
        return searchs.getError();
    }

    function restartSearch() {
        searchs.restartResults();
        images.restartResults();
    }

    function isSearching() {
        return searchs.isSearching() || images.isSearching();
    }

    function handleSearchPromise(promiseSearch) {
        if (promiseSearch) {
            promiseSearch.then(function(response) {
                searchsView.render();
                searchsView.renderPagination();
                formView.render();
            }).catch(function(reason) {
                searchsView.render();
                searchsView.renderPagination();
                formView.render();
                console.log('Promise rejected (' + reason + ').');
            });
        }
    }

    function handleImagePromise(promiseImages) {
        if (promiseImages) {
            promiseImages.then(function(response) {
                imagesView.render();
                imagesView.renderPagination();
                formView.render();
            }).catch(function(reason) {
                imagesView.render();
                imagesView.renderPagination();
                formView.render();
                console.log('Promise rejected (' + reason + ').');
            });
        }
    }

    function doSearch(text) {
        if (!controller.isSearching()) {
            currentSearchText = text;
            controller.handleSearchPromise(searchs.doSearch(text));
            controller.handleImagePromise(images.doSearch(text));
        }
    }

    function previousPageImage() {
        if (!controller.isSearching()) {
            controller.handleImagePromise(images.previousPage());
        }
    }

    function previousPageSearch() {
        if (!controller.isSearching()) {
            controller.handleSearchPromise(searchs.previousPage());
        }
    }

    function nextPageImage() {
        if (!controller.isSearching()) {
            controller.handleImagePromise(images.nextPage());
        }
    }

    function nextPageSearch() {
        if (!controller.isSearching()) {
            controller.handleSearchPromise(searchs.nextPage());
        }
    }

    function goToPageImages(page) {
        if (!controller.isSearching()) {
            controller.handleImagePromise(images.goToPage(page));
        }
    }

    function goToPageSearchs(page) {
        if (!controller.isSearching()) {
            controller.handleSearchPromise(searchs.goToPage(page));
        }
    }

    ///////////////////////////////////////
    // Form view //////////////////////////
    ///////////////////////////////////////

    function initFormView() {
        var self = this;
        self.content = document.getElementById("content");
        self.btnSearch = document.getElementById("btnSearch");
        self.spinner = document.getElementById("spinner");
        self.textSearch = document.getElementById("textSearch");
        self.content.style.display = "none";
        var clickSearch = function(event) {
            self.spinner.classList.add('fa-spin');
            self.spinner.classList.add('fa-circle-o-notch');
            controller.restartSearch();
            self.content.style.display = "block";
            controller.doSearch(self.textSearch.value);
        };
        self.btnSearch.addEventListener('click', clickSearch);
        var keyPressSearch = function(event) {
            var keyCode = event.which;
            if (keyCode == 13) {
                self.spinner.classList.add('fa-spin');
                self.spinner.classList.add('fa-circle-o-notch');
                self.content.style.display = "block";
                controller.restartSearch();
                controller.doSearch(self.textSearch.value);
            }
        };
        self.textSearch.addEventListener('keypress', keyPressSearch);
    }

    function renderFormView() {
        this.spinner.classList.remove('fa-spin');
        this.spinner.classList.remove('fa-circle-o-notch');
    }


    ///////////////////////////////////////
    // Search view ////////////////////////
    ///////////////////////////////////////

    function initSearchView() {
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
    }

    function renderSearchView() {
        this.sectionSearchs.style.display = "block";
        this.searchList.innerHTML = "";
        this.totalResults.innerHTML = "";
        this.errorSearch.innerHTML = "";
        if (controller.getErrorSearch() !== "" || controller.getSearchs().length === 0) {
            renderError(this.searchList, this.errorSearch, controller.getErrorSearch(), controller.getSearchs().length);
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
    }

    function renderSearchPagination() {
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
                eventPageKeyPress(event.which, inputPage, controller.getCurrentPageSearch(), controller.goToPageSearchs);
            };
            inputPage.addEventListener('keypress', pageKeyPress);
            this.paginationSearchs.appendChild(inputPage);
            this.paginationSearchs.appendChild(Utilities.CreateButton(">", !controller.hasNextSearchs(), this.clickNext));
        }
    }

    ///////////////////////////////////////
    // Images view ////////////////////////
    ///////////////////////////////////////

    function initImageView() {
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
    }

    function renderImageView() {
        this.sectionImages.style.display = "block";
        this.imagesList.innerHTML = "";
        this.totalImages.innerHTML = "";
        this.errorImages.innerHTML = "";
        if (controller.getErrorImages() !== "" || controller.getImages().length === 0) {
            renderError(this.imagesList, this.errorImages, controller.getErrorImages(), controller.getImages().length);
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
    }

    function renderImagePagination() {
        this.paginationImages.innerHTML = '';
        if (controller.getErrorImages() !== "") {
            this.paginationImages.style.display = "none";
        } else {
            this.paginationImages.style.display = "inline-block";
            this.paginationImages.appendChild(Utilities.CreateButton("<", !controller.hasPreviousImages(), this.clickPrevious));
            var inputPage = document.createElement('input');
            inputPage.type = 'text';
            inputPage.value = controller.getCurrentPageImages();
            var pageKeyPress = function(event) {
                eventPageKeyPress(event.which, inputPage, controller.getCurrentPageImages(), controller.goToPageImages);
            };
            inputPage.addEventListener('keypress', pageKeyPress);
            this.paginationImages.appendChild(inputPage);
            this.paginationImages.appendChild(Utilities.CreateButton(">", !controller.hasNextImages(), this.clickNext));
        }
    }

    /**
     * Functionality that has the key event on a page input
     * @param  {Int}        keyCode      Key code
     * @param  {Element}    inputPage    Input to evaluate
     * @param  {Int}        currentPage  Current page
     * @param  {Function}   callback     Function to execute if everything is ok
     */
    function eventPageKeyPress(keyCode, inputPage, currentPage, callback) {
        if (keyCode == 13) {
            var newPage = Utilities.TryParseInt(inputPage.value, currentPage);
            if (newPage > 0) {
                callback(newPage);
            } else {
                inputPage.value = currentPage;
            }
        }
    }

    /**
     * Set the error/info/warning in the page
     * @param  {Element} listElement    Can be search list or image list
     * @param  {Element} errorElement   Search div error or image div error
     * @param  {String} errorMsg        Message that will be shown as error/warning if empty => no results items
     * @param  {Int} itemsLength        Number of elements returned in the search
     */
    function renderError(listElement, errorElement, errorMsg, itemsLength) {
        listElement.style.display = "none";
        errorElement.style.display = "block";
        errorElement.className = 'message-info';
        if (errorMsg !== "") {
            errorElement.innerHTML = errorMsg;
            if (controller.getCurrentSearchText() === '') {
                errorElement.className += ' warning';
            } else {
                errorElement.className += ' error';
            }
        } else {
            errorElement.innerHTML = "No item found for the specified criteria";
            errorElement.className += ' info';
        }
    }
});