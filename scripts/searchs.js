define(function(searchs) {      
  var searchs = [
  {
    counter: 0,
    name: 'Tabby',
    image: 'images/434164568_fea0ad4013_z.png',
    imgAttribution: 'https://www.flickr.com/photos/bigtallguy/434164568'
  },
  {
    counter: 0,
    name: 'Tiger',
    image: 'images/4154543904_6e2428c421_z.png',
    imgAttribution: 'https://www.flickr.com/photos/xshamx/4154543904'
  },
  {
    counter: 0,
    name: 'Scaredy',
    image: 'images/22252709_010df3379e_z.png',
    imgAttribution: 'https://www.flickr.com/photos/kpjas/22252709'
  },
  {
    counter: 0,
    name: 'Shadow',
    image: 'images/1413379559_412a540d29_z.png',
    imgAttribution: 'https://www.flickr.com/photos/malfet/1413379559'
  },
  {
    counter: 0,
    name: 'Sleepy',
    image: 'images/9648464288_2516b35537_z.png',
    imgAttribution: 'https://www.flickr.com/photos/onesharp/9648464288'
  }
  ];
  return {
    getSearchs: function() {
      console.log("Function : getSearchs");
      return searchs;
    },    
    doSearch: function(text) {
      var promise = new Promise(
        function(resolve, reject) {
          var searchUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAOc6SKyG4SUUsMc6tkdel5Fm5Dhw7c-fw&cx=010392540248394977835:nhfejhgta08&q=' + encodeURIComponent(text);
          var x = new XMLHttpRequest();
          x.open('GET', searchUrl);
          x.responseType = 'json';
          x.onload = function() {
            // Parse and process the response from Google Image Search.
            var response = x.response;
            if (!response || !response.items) {
              console.log( "loading error" );
            }
            resolve(response.items);
          };
          x.onerror = function() {
            alert("error")
            document.writeln("network error");            
            reject("error");
          };
          x.send();
       }
       );
      return promise;
    }
  }
});