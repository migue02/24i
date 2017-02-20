define(function(GoogleCustomSearch) {

    var GoogleCustomSearch = {
        doSearch: doSearch
    };

    return GoogleCustomSearch;

    /////////////////////////////////////////////

    /**
     * Make a request to Google Custom Search API and return a Promise with the response
     * @param  {String}  query      Text to search
     * @param  {Int}     start      Offset
     * @param  {Int}     count      Number of items you want to obtain
     * @param  {String}  searchType The type of the search 'image'
     * @return {Promise} Promise with the response
     */
    function doSearch(query, start, count, searchType) {
        var searchUrl = 'https://www.googleapis.com/customsearch/v1',
            searchParams = {
                //key: 'AIzaSyAOc6SKyG4SUUsMc6tkdel5Fm5Dhw7c-fw',
                key: 'AIzaSyBIS7VN1Ro1IN_R4rsyaMenrPrsFwke7JI',
                //key: 'AIzaSyBvTHkbp8F62bEMIAhef8-CE_tJPZFhI1Y',
                cx: '010392540248394977835:nhfejhgta08',
                q: encodeURIComponent(query),
                start: start,
                num: count
            };
        if (searchType) {
            searchParams.searchType = searchType;
        }

        var promise = new Promise(
            function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', searchUrl + '?' + convertToString(searchParams));
                request.responseType = 'json';
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        var response = request.response;
                        if (request.status !== 200) {
                            rejectError(request.response, reject);
                            return;
                        }
                        if (!response) {
                            reject("loading error");
                        } else if (response.error) {
                            reject(response.error.message);
                        } else {
                            resolve(response);
                        }
                    }
                };
                request.onerror = function() {
                    rejectError(request.response, reject);
                };
                request.send();
            });
        return promise;
    }

    /**
     * Handle the error messagge
     * @param  {Promise}  response Response of the request
     * @param  {Callback} reject   
     */
    function rejectError(response, reject) {
        if (!response) {
            reject("network error");
        } else if (response.error) {
            var error = "<b>Code:</b> " + response.error.code + " <b>Message:</b> " + response.error.message;
            if (response.error.errors && response.error.errors.length > 0) {
                error = error + " <b>Reason:</b> " + response.error.errors[0].reason;
            }
            reject(error);
        } else {
            reject("network error");
        }
    }

    /**
     * Convert an object to a encoded query string
     * @param  {Object} object Object to convert
     * @return {String}        [description]
     */
    function convertToString(object) {
        var result = '';
        var resultArray = [];

        for (var property in object) {
            result = property + '=' + encodeURIComponent(object[property]);
            resultArray.push(result);
        }

        return resultArray.join('&');
    }

});