// ==UserScript==
// @name           twitter-local
// @namespace      geoapi.com
// @include        http://twitter.com/*
// @include        http://search.twitter.com/*
// @include        https://twitter.com/*
// ==/UserScript==


// API cache to avoid duplicating requests on a single page load.
var api_cache = {}

// Simple wrapper around a search query
function geoapi_location_search(lat, lon, type, radius, include_parents, 
                                limit, callback_fn) {
    // Build the search query
    var server = 'http://api.geoapi.com/v1'
    var url = server + '/search?apikey=demo'
    url += '&lat=' + lat // lat/lon to search from
    url += '&lon=' + lon
    if (include_parents) { // whether to include parents of entities in result (ex. 1)
        url += '&include-parents=1'
    }
    if (type) { // type constraint (ex. POI)
        url += '&type=' + type
    }
    if (radius) { // search radius (ex. 1km)
        url += '&radius=' + radius
    }
    if (limit) { // number of results to return (ex. 20)
        url += '&limit=' + limit
    }
    process_call(url, callback_fn)
}

// Simple wrapper around a parent query
function geoapi_parent_search(lat, lon, callback_fn) {
    // Build the search query
    var server = 'http://api.geoapi.com/v1'
    var url = server + '/parents?apikey=demo'
    url += '&lat=' + lat // lat/lon to search from
    url += '&lon=' + lon
    process_call(url, callback_fn)
}

function process_call(url, callback_fn) {
    if (api_cache[url]) { // If the same query has already been requested
        api_cache[url].callbacks.push(callback_fn)
        if (api_cache[url].response) { // If the query has already returned a response
            callback_fn(api_cache[url].response)
        }
    } else { // If it's the first time the query is requested, actually make the call
        api_cache[url] = {callbacks: [callback_fn]}
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var my_callbacks = api_cache[url].callbacks
                var resp = eval('(' + responseDetails.responseText + ')')
                api_cache[url].response = resp
                for (var j = 0; j < my_callbacks.length; j++) {
                    my_callbacks[j](resp)
                }
            }
        });
    }
    
    
}

function checkBiz(entry) {
    // Look through tweets on the page and search for text starting with '::'
    // and try to see if a closeby entity matches. To see an example of this,
    // go to http://twitter.com/geoapidemo
    var re=/::[\w-]+/g
    // Assume that user is at Ritual Roasters in SF
    var lat = '37.75647'
    var lon = '-122.421218'
    for (var i = 0; i < entry.childNodes.length; i++) {
        var node = entry.childNodes[i]
        if (node.nodeName == "#text") { // For all text nodes
            var text = node.textContent
            var matches = text.match(re)
            if (matches) { // For substring starting with '::'
                for (j=0; j < matches.length; j++) {
                    var name = matches[j]
                    var name_re = new RegExp(name.substring(2).replace('-', '\\s'), 'i')                    
                    geoapi_location_search(lat, lon, null, '1km', false, 100, // Search for closeby entities
                       function(resp) {
                           if (!resp.result) {
                               return
                           }
                           for (var i = 0; i < resp.result.length; i++) {
                               var result = resp.result[i]
                               if (result.meta.name.match(name_re)) {
                                   text = node.textContent.split(name) // Replace text with link, similary to hashtags
                                   node.textContent = text[0]
                                   node.parentNode.insertBefore(document.createTextNode(text[1]), node.nextSibling)
                                   var link = document.createElement("a")
                                   link.href = 'http://geoapi.com/e/'+result.guid
                                   link.setAttribute('alt', result.meta.name)
                                   link.setAttribute('title', result.meta.name)
                                   link.appendChild(document.createTextNode(name.substring(2)))
                                   node.parentNode.insertBefore(link, node.nextSibling)
                                   node.parentNode.insertBefore(document.createTextNode('::'), node.nextSibling)
                                   return
                               }
                           } 
                       })
                }
            }
        }
    }
}

function addParents(entry) {
    // On search result pages, look for things that look like lat/lon's
    // and add that point's parents.
    // To see an example, go to http://search.twitter.com/search?q=+near%3A%22san+francisco%22+within%3A5mi
    var re=/(-?\d+\.\d+),(-?\d+\.\d+)/
    var match=re.exec(entry.textContent)
    if (match){
        geoapi_parent_search(match[1], match[2], 
           function(resp) {
               if (!resp.result) {
                   return
               }
               var parents = resp.result.parents
               for (var i=0; i < parents.length; i++) {
                   if (parents[i].meta.type == 'neighborhood') {
                       entry.innerHTML += "<br><span style='color:red'>" + parents[i].meta.name + "</span>";
                       return
                   }
               }
           })
    }    
}


// Get tweets on a user page and link potential business entities. Once you
// install this script, try going to http://twitter.com/geoapidemo
var statusBodyElems = document.getElementsByClassName('entry-content');
if (statusBodyElems) {
    for (var i = 0; i < statusBodyElems.length; i++) {
      checkBiz(statusBodyElems[i])
    }
} 

// Get locations and for ones that seem to be lat/lons, show the parent
// neighborhood of that point. Once you install this script, try going to 
// http://search.twitter.com/search?q=+near%3A%22san+francisco%22+within%3A5mi
var statusBodyElems = document.getElementsByClassName('location');
if (statusBodyElems) {
    for (var i = 0; i < statusBodyElems.length; i++) {
      addParents(statusBodyElems[i])
    }
}