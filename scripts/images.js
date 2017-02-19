define('images', ['genericSearch'], function(genericSearch) {
  var options = genericSearch.initOptions('image');

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
    return genericSearch.getResults(options);
  }

  function getTotalSearchs() {
    return genericSearch.getTotalSearchs(options);
  }

  function doSearch(text) {
    options.searchText = text;
    return genericSearch.doSearch(options);
  }

  function nextPage() {
    return genericSearch.nextPage(options);
  }

  function previousPage() {
    return genericSearch.previousPage(options);
  }
});