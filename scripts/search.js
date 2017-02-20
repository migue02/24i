define('search', ['GoogleCustomSearch'], function(GoogleCustomSearch) {

  /**
   * Constructor of the search object
   * 
   * @param {Boolean} If true, it sets the searchType to 'image' to do an only image search
   */
  function search(hassearchType) {
    this.searchText = '';
    this.startIndex = 1;
    this.next = null;
    this.previous = null;
    this.count = 10;
    this.totalResults = 0;
    this.formattedTotalResults = '';
    this.error = '';
    this.results = [];
    if (hassearchType) {
      this.searchType = 'image';
    }
    this.currentPage = 1;
  }

  /**
   * Restart the properties that are used in each search
   */
  search.prototype.restartResults = function() {
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
  search.prototype.getResults = function() {
    return this.results;
  };

  /**
   * @return {String} Total result of the search 
   */
  search.prototype.getTotalsearchs = function() {
    return this.totalResults;
  };

  /**
   * @return {String} Total result of the search with html marks
   */
  search.prototype.getFormattedTotalsearchs = function() {
    return this.formattedTotalResults;
  };

  /**
   * @return {Int} Return de current number page of the search
   */
  search.prototype.getCurrentPage = function() {
    return this.currentPage;
  };

  /**
   * @return {String} The error that had occurred in the search function
   */
  search.prototype.getError = function() {
    return this.error;
  }

  /**
   * @return {Boolean} If it is searching
   */
  search.prototype.issearching = function() {
    return this.searching;
  }

  /**
   * Call the function dosearch of GoogleCustomsearch with the text specified
   * 
   * @param  {String} Text to search
   * @return {Promise}
   */
  search.prototype.dosearch = function(text) {
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
          GoogleCustomSearch.dosearch(self.searchText, self.startIndex, self.count, self.searchType).then(function(response) {
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
            self.currentPage = 1;
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
  search.prototype.hasNext = function() {
    return this.next !== null && !isNaN(this.next.startIndex) && this.next.startIndex !== null;
  };

  /**
   * Check if there is a previous page
   * 
   * @return {Boolean} True if exists previous page
   */
  search.prototype.hasPrevious = function() {
    return this.previous !== null && !isNaN(this.previous.startIndex) && this.previous.startIndex !== null;
  };

  /**
   * Get the search page specified
   * 
   * @param  {Int} The target number page
   * @return {Promise}
   */
  search.prototype.goToPage = function(page) {
    this.currentPage = page;
    this.count = 10;
    this.startIndex = ((page - 1) * this.count) + 1;
    return this.dosearch(this.searchText);
  };

  /**
   * Get the next page of the search if exists
   * 
   * @return {Promise}
   */
  search.prototype.nextPage = function() {
    if (this.hasNext()) {
      this.currentPage++;
      this.startIndex = this.next.startIndex;
      this.count = this.next.count;
      return this.dosearch(this.next.searchTerms);
    }
  };

  /**
   * Get the previous page of the search if exists
   * 
   * @return {Promise}
   */
  search.prototype.previousPage = function() {
    if (this.hasPrevious()) {
      this.currentPage--;
      this.startIndex = this.previous.startIndex;
      this.count = this.previous.count;
      return this.dosearch(this.previous.searchTerms);
    }
  };

  return search;
});