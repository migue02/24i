define(['genericSearch'], function(genericSearch) {
  var GoogleCustomSearch = require('GoogleCustomSearch');

  var self = {
    initOptions: initOptions,
    getResults: getResults,
    getTotalSearchs: getTotalSearchs,
    doSearch: doSearch,
    nextPage: nextPage,
    previousPage: previousPage
  };

  return self;

  ////////////////////////////////////////////////////

  function initOptions(hasSearchType) {
    var options = {
      searchText: '',
      startIndex: 1,
      nextIndex: null,
      previousIndex: null,
      count: 10,
      totalResults: 0,
      results: []
    };
    if (hasSearchType) {
      options.searchType = 'image';
    }
    return options;
  }

  function restartResults(options) {
    options.totalResults = 0;
    options.results = [];
    options.startIndex = 1;
    options.nextIndex = null;
    options.previousIndex = null;
    options.count = 10;
  }

  function getResults(options) {
    return options.results;
  }

  function getTotalSearchs(options) {
    return options.totalResults;
  }

  function doSearch(options) {
    var promise = new Promise(
      function(resolve, reject) {
        GoogleCustomSearch.doSearch(options.searchText, options.startIndex, options.count, options.searchType).then(function(response) {
          restartResults(options);
          if (response.items) {
            options.results = response.items;
          }
          if (response.searchInformation) {
            options.totalResults = response.searchInformation.totalResults;
          }
          if (response.queries) {
            if (response.queries.request) {
              options.startIndex = response.queries.request[0].startIndex;
              options.count = response.queries.request[0].count;
            }
            if (response.queries.nextPage) {
              options.nextIndex = response.queries.nextPage[0].startIndex;
            }
            if (response.queries.previousPage) {
              options.previousIndex = response.queries.previousPage[0].startIndex;
            }
          }
          resolve(response);
        }).catch(function(reason) {
          reject(reason);
        });
      });
    return promise;
  }

  function hasNext(options) {
    return !isNaN(options.nextIndex);
  }

  function hasPrevious(options) {
    return !isNaN(options.previousIndex);
  }

  function nextPage(options) {
    if (hasNext(options)) {
      options.startIndex = options.nextIndex;
      return doSearch(options.searchText);
    }
  }

  function previousPage(options) {
    if (hasPrevious(options)) {
      options.startIndex = options.previousIndex;
      return doSearch(options.searchText);
    }
  }

});