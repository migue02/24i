require(['Search', 'Utilities'], function(Search, Utilities) {

    var searchs = new Search();
    var images = new Search(true);

    var controller = {
        currentSearchText: '',
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
        setLoading: setLoadingFormView
    };


    var searchsView = {
        init: initSearchView,
        setLoading: setLoadingSearchView,
        render: renderSearchView,
        renderPagination: renderSearchPagination
    };


    var imagesView = {
        init: initImageView,
        setLoading: setLoadingImageView,
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
        return controller.currentSearchText;
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

    function doSearch(text) {
        if (!controller.isSearching()) {
            controller.currentSearchText = text;
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

    function handleSearchPromise(promiseSearch) {
        if (promiseSearch) {
            promiseSearch.then(function(response) {
                searchsView.render();
                searchsView.renderPagination();
                searchsView.setLoading(false);
                formView.setLoading(false);
            }).catch(function(reason) {
                searchsView.render();
                searchsView.renderPagination();
                searchsView.setLoading(false);
                formView.setLoading(false);
                console.log('Promise rejected (' + reason + ').');
            });
        }
    }

    function handleImagePromise(promiseImages) {
        if (promiseImages) {
            promiseImages.then(function(response) {
                imagesView.setLoading(false);
                imagesView.render();
                imagesView.renderPagination();
                formView.setLoading(false);
            }).catch(function(reason) {
                imagesView.setLoading(false);
                imagesView.render();
                imagesView.renderPagination();
                formView.setLoading(false);
                console.log('Promise rejected (' + reason + ').');
            });
        }
    }

    ///////////////////////////////////////
    // Form view //////////////////////////
    ///////////////////////////////////////
    
    /**
     * Initializes all the elements to be used in the search box view, and the events
     */
    function initFormView() {
        var self = this;
        self.content = document.getElementById("content");
        self.btnSearch = document.getElementById("btnSearch");
        self.spinner = document.getElementById("spinner");
        self.textSearch = document.getElementById("textSearch");
        var clickSearch = function(event) {   
            setLoadingFormView(true);         
            controller.restartSearch();
            controller.doSearch(self.textSearch.value);
        };
        self.btnSearch.addEventListener('click', clickSearch);
        var keyPressSearch = function(event) {
            var keyCode = event.which;
            if (keyCode == 13) {
                setLoadingFormView(true); 
                controller.restartSearch();
                controller.doSearch(self.textSearch.value);
            }
        };
        self.textSearch.addEventListener('keypress', keyPressSearch);
    }

    /**
     * Set loading state of search box view if isLoading is true
     * @param  {Boolean}  isLoading  If true set the loading state
     */   
    function setLoadingFormView(isLoading) {
        if (isLoading){
            this.content.style.display = "none";
            this.spinner.classList.add('loading');
            this.spinner.classList.add('fa-spin');
            this.spinner.classList.add('fa-circle-o-notch');
        } else {
            this.spinner.classList.remove('loading');
            this.spinner.classList.remove('fa-spin');
            this.spinner.classList.remove('fa-circle-o-notch');
            this.content.style.display = "block";
        }
    }


    ///////////////////////////////////////
    // Search view ////////////////////////
    ///////////////////////////////////////

    /**
     * Initializes all the elements to be used in the search view, and the events
     */
    function initSearchView() {
        var self = this;
        this.sectionSearchs = document.getElementById("sectionSearchs");
        this.paginationSearchs = document.getElementById("paginationSearchs");
        this.totalResults = document.getElementById("totalResults");
        this.searchList = document.getElementById("searchList");
        this.errorSearch = document.getElementById("errorSearch");
        this.btnPreviousSearch = document.getElementById("btnPreviousSearch");
        this.inputPageSearch = document.getElementById("inputPageSearch");
        this.btnNextSearch = document.getElementById("btnNextSearch");
        this.sectionSearchs.style.display = "none";
        this.totalResults.innerHTML = "";
        var clickPrevious = function(event) {
            setLoadingSearchView(true);
            controller.previousPageSearch();
        };
        var clickNext = function(event) {
            setLoadingSearchView(true);
            controller.nextPageSearch();
        };
        var pageKeyPress = function(event) {
            if (event.which === 13){
                setLoadingSearchView(true);
                eventPageKeyPress(self.inputPageSearch, controller.getCurrentPageSearch(), controller.goToPageSearchs);
            }
        };
        this.btnPreviousSearch.addEventListener('click', clickPrevious);
        this.btnNextSearch.addEventListener('click', clickNext);
        this.inputPageSearch.addEventListener('keypress', pageKeyPress);
    }

    /**
     * Set loading state if isLoading is true
     * @param  {Boolean}  isLoading  If true set the loading state
     */    
     function setLoadingSearchView(isLoading) {
        if (isLoading){
            this.sectionSearchs.classList.add('loading');
            this.paginationSearchs.classList.add('loading');
        } else {
            this.sectionSearchs.classList.remove('loading');
            this.paginationSearchs.classList.remove('loading');
        }
    }

    /**
     * Renders the search list of the search section
     */
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

    /**
     * Renders the pagination of the search section
     */
    function renderSearchPagination() {
        if (controller.getErrorSearch() !== "") {
            this.paginationSearchs.style.display = "none";
        } else {
            this.paginationSearchs.style.display = "inline-block";
            this.btnPreviousSearch.disabled = !controller.hasPreviousSearchs();
            this.btnNextSearch.disabled = !controller.hasNextSearchs();
            this.inputPageSearch.value = controller.getCurrentPageSearch();
        }
    }

    ///////////////////////////////////////
    // Images view ////////////////////////
    ///////////////////////////////////////

    /**
     * Initializes all the elements to be used in the image view, and the events
     */
    function initImageView() {
        var self = this;
        this.sectionImages = document.getElementById("sectionImages");
        this.paginationImages = document.getElementById("paginationImages");
        this.totalImages = document.getElementById("totalImages");
        this.imagesList = document.getElementById("imagesList");
        this.errorImages = document.getElementById("errorImages");
        this.btnPreviousImage = document.getElementById("btnPreviousImage");
        this.inputPageImage = document.getElementById("inputPageImage");
        this.btnNextImage = document.getElementById("btnNextImage");
        this.sectionImages.style.display = "none";
        this.totalImages.innerHTML = "";
        var clickPrevious = function(event) {
            setLoadingImageView(true);
            controller.previousPageImage();
        };
        var clickNext = function(event) {
            setLoadingImageView(true);
            controller.nextPageImage();
        };
        var pageKeyPress = function(event) {
            if (event.which === 13){
                setLoadingImageView(true);
                eventPageKeyPress(self.inputPageImage, controller.getCurrentPageImages(), controller.goToPageImages);
            }
        };
        this.btnPreviousImage.addEventListener('click', clickPrevious);
        this.btnNextImage.addEventListener('click', clickNext);
        this.inputPageImage.addEventListener('keypress', pageKeyPress);
    }

    /**
     * Set loading state if isLoading is true
     * @param  {Boolean}  isLoading  If true set the loading state
     */    
     function setLoadingImageView(isLoading) {
        if (isLoading){
            this.sectionImages.classList.add('loading');
            this.paginationImages.classList.add('loading');
        } else {
            this.sectionImages.classList.remove('loading');
            this.paginationImages.classList.remove('loading');
        }
    }

    /**
     * Renders the image list of the image section
     */
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

    /**
     * Renders the pagination of the image section
     */
    function renderImagePagination() {
        if (controller.getErrorImages() !== "") {
            this.paginationImages.style.display = "none";
        } else {
            this.paginationImages.style.display = "inline-block";
            this.btnPreviousImage.disabled = !controller.hasPreviousImages();
            this.btnNextImage.disabled = !controller.hasNextImages();
            this.inputPageImage.value = controller.getCurrentPageImages();
        }
    }

    /**
     * Functionality that has the key event on a page input (when keyCode === 13)
     * @param  {Element}    inputPage    Input to evaluate
     * @param  {Int}        currentPage  Current page
     * @param  {Function}   callback     Function to execute if everything is ok
     */
    function eventPageKeyPress(inputPage, currentPage, callback) {
        var newPage = Utilities.TryParseInt(inputPage.value, currentPage);
        if (newPage > 0) {
            callback(newPage);
        } else {
            inputPage.value = currentPage;
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