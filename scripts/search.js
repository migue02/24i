define('Search', ['GoogleCustomSearch'], function(GoogleCustomSearch) {

  /**
   * Constructor of the Search object
   * 
   * @param {Boolean} If true, it sets the searchType to 'image' to do an only image search
   */
  function Search(hasSearchType) {
    this.searchText = '';
    this.startIndex = 1;
    this.next = null;
    this.previous = null;
    this.count = 10;
    this.totalResults = 0;
    this.formattedTotalResults = '';
    this.error = '';
    this.results = [];
    if (hasSearchType) {
      this.searchType = 'image';
    }
    this.currentPage = 1;
  }

  /**
   * Restart the properties that are used in each search
   */
  Search.prototype.restartResults = function() {
    this.totalResults = 0;
    this.formattedTotalResults = '';
    this.results = [];
    this.startIndex = 1;
    this.count = 10;
    this.error = '';
    this.next = null;
    this.previous = null;
  };

  /**
   * The items result of the search. Each item has this structure
   * {cacheId
   *  displayLink
   *  formattedUrl
   *  htmlFormattedUrl
   *  htmlSnippet
   *  htmlTitle
   *  kind
   *  link
   *  snippet
   *  title}
   * @return {Array} Result of the search
   */
  Search.prototype.getResults = function() {
    return this.results;
  };

  /**
   * @return {String} Total result of the search 
   */
  Search.prototype.getTotalSearchs = function() {
    return this.totalResults;
  };

  /**
   * @return {String} Total result of the search with html marks
   */
  Search.prototype.getFormattedTotalSearchs = function() {
    return this.formattedTotalResults;
  };

  /**
   * @return {Int} Return de current number page of the search
   */
  Search.prototype.getCurrentPage = function() {
    return this.currentPage;
  };

  /**
   * @return {String} The error that had occurred in the search function
   */
  Search.prototype.getError = function() {
    return this.error;
  }

  /**
   * @return {Boolean} If it is searching
   */
  Search.prototype.isSearching = function() {
    return this.searching;
  }

  /**
   * Call the function doSearch of GoogleCustomSearch with the text specified
   * 
   * @param  {String} Text to search
   * @return {Promise}
   */
  Search.prototype.doSearch = function(text) {
    var self = this;
    this.searching = true;
    if (text !== this.searchText) {
      this.restartResults();
      this.currentPage = 1;
    }
    this.searchText = text;
    var promise = new Promise(
      function(resolve, reject) {
        if (self.searchText !== '') {
          GoogleCustomSearch.doSearch(self.searchText, self.startIndex, self.count, self.searchType).then(function(response) {
            self.restartResults();
            if (response.items) {
              self.results = response.items;
            }
            if (response.searchInformation) {
              self.totalResults = response.searchInformation.totalResults;
              self.formattedTotalResults = response.searchInformation.formattedTotalResults;
            }
            if (response.queries) {
              if (response.queries.request) {
                self.startIndex = response.queries.request[0].startIndex;
                self.count = response.queries.request[0].count;
              }
              if (response.queries.nextPage) {
                self.next = response.queries.nextPage[0];
              }
              if (response.queries.previousPage) {
                self.previous = response.queries.previousPage[0];
              }
            }
            resolve(response);
            self.searching = false;
          }).catch(function(reason) {
            self.restartResults();
            self.error = reason;
            self.searching = false;
            reject(reason);
          });
        } else {
          self.restartResults();
          self.error = 'The search text cannot be empty';
          self.searching = false;
          resolve([]);
        }
      });
    return promise;
  };

  /**
   * Check if there is a next page
   * 
   * @return {Boolean} True if exists next page
   */
  Search.prototype.hasNext = function() {
    return this.next !== null && !isNaN(this.next.startIndex) && this.next.startIndex !== null;
  };

  /**
   * Check if there is a previous page
   * 
   * @return {Boolean} True if exists previous page
   */
  Search.prototype.hasPrevious = function() {
    return this.previous !== null && !isNaN(this.previous.startIndex) && this.previous.startIndex !== null;
  };

  /**
   * Get the search page specified
   * 
   * @param  {Int} The target number page
   * @return {Promise}
   */
  Search.prototype.goToPage = function(page) {
    this.currentPage = page;
    this.count = 10;
    this.startIndex = ((page - 1) * this.count) + 1;
    return this.doSearch(this.searchText);
  };

  /**
   * Get the next page of the search if exists
   * 
   * @return {Promise}
   */
  Search.prototype.nextPage = function() {
    if (this.hasNext()) {
      this.currentPage++;
      this.startIndex = this.next.startIndex;
      this.count = this.next.count;
      return this.doSearch(this.next.searchTerms);
    }
  };

  /**
   * Get the previous page of the search if exists
   * 
   * @return {Promise}
   */
  Search.prototype.previousPage = function() {
    if (this.hasPrevious()) {
      this.currentPage--;
      this.startIndex = this.previous.startIndex;
      this.count = this.previous.count;
      return this.doSearch(this.previous.searchTerms);
    }
  };

  return Search;
});