define(['images'], function(images) {
  var GenericSearch = require('genericSearch');
  var options = GenericSearch.initOptions('image');

  var self = {
    getResults: getResults,
    getTotalSearchs: getTotalSearchs,
    doSearch: doSearch,
    nextPage: nextPage,
    previousPage: previousPage
  };

  return self;

  ///////////////////////////////////////////////////////////

  function getResults() {
    return GenericSearch.getResults(options);
  }

  function getTotalSearchs() {
    return GenericSearch.getTotalSearchs(options);
  }

  function doSearch(text) {
    options.searchText = text;
    return GenericSearch.doSearch(options);
  }

  function nextPage() {
    return GenericSearch.nextPage(options);
  }

  function previousPage() {
    return GenericSearch.previousPage(options);
  }
});