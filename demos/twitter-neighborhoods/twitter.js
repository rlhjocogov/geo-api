// Copyright 2009 Mixer Labs.  All Rights Reserved.
//
// GeoAPI Twitter Demo.

var _listings = [];
var _apikey;
var _lat;
var _lon;
var _map;
var _guid = null;

google.load("maps", "2.x");
google.load("jquery", "1.3.1");

var NEIGHBORHOODS = [
    [ 'castro-upper-market-san-francisco-ca', "Castro-Upper Market"],
    [ 'chinatown-san-francisco-ca', "Chinatown"],
    [ 'downtown-san-francisco-ca', "Downtown"],
    [ 'financial-district-san-francisco-ca', "Financial District"],
    [ 'haight-ashbury-san-francisco-ca', "Haight-Ashbury"],
    [ 'marina-san-francisco-ca', "Marina"],
    [ 'mission-san-francisco-ca', "Mission"],
    [ 'north-beach-san-francisco-ca', "North Beach"],
    [ 'outer-richmond-san-francisco-ca', "Outer Richmond"],
    [ 'outer-sunset-san-francisco-ca', "Outer Sunset"],
    [ 'presidio-heights-san-francisco-ca', "Presidio Heights"],
    [ 'south-of-market-san-francisco-ca', "South Of Market"],
];

// HTML escape a string.
function escapeHTML(s) {
    return s.split("&").join("&amp;").
	split("<").join("&lt;").split(">").join("&gt;");
}

// Initialize the map and the mode.
function init() {
    if (GBrowserIsCompatible()) {
	_map = new GMap2($("#map_canvas").get(0));
	_map.setCenter(new GLatLng($("#lat").val(), $("#lon").val()), 12);
	_map.addControl(new GLargeMapControl());
    }

    initNeighborhoods();
}

function initNeighborhoods() {
    $("#neighborhoods").empty();
    for (var i = 0; i < NEIGHBORHOODS.length; ++i) {
	guid = NEIGHBORHOODS[i][0];
	name = NEIGHBORHOODS[i][1];
	var tdClass = "";
	if (guid == _guid) {
	    tdClass = "selected_neighborhood";
	}
	$("#neighborhoods").append(
	    '<tr><td class="' + tdClass +
            '"><a class="neighborhood" href="#" onclick="requestTweets(\'' +
	    guid + '\')">' + escapeHTML(name) + '</a></td></tr>');
    }
}

function createMarker(point, text) {
    var marker = new GMarker(point);

    GEvent.addListener(marker, "click", function() {
	marker.openInfoWindowHtml('<div class="maptweet">' + text + '</div>');
    });
    return marker;
}

// Add a point of interest to the map.
function addMapPoint(text, lat, lon) {
    var point = new GLatLng(lat, lon);
    _map.addOverlay(createMarker(point, text));
}

// Update the status line (e.g. searching, errors, etc.)
function updateStatus(status) {
    $("#status").text(status);
}

// Get tweets near guid.
function requestTweets(guid) {
    if (_guid == null) {
	// Get new tweets every minute.
	setInterval(requestTweetsForCurrentNeighborhood, 60000);
    }
    _guid = guid;
    initNeighborhoods();
    requestTweetsForCurrentNeighborhood();
}

function requestTweetsForCurrentNeighborhood() {
    if (_guid == null) {
	return;
    }
    updateStatus("Searching...");
    _listings = [];
    _apikey = $("#apikey").val();

    $.getJSON("http://api.geoapi.com/e/" + escape(_guid) +
	      "/view/twitter?apikey=" + escape(_apikey) +
	      "&jsoncallback=?",
	      showTweets);
}

// Parses JSON data from the GeoAPI to build a data structure with tweet data.
function showTweets(data) {
    var entities = data['result'];
    if (entities == null) {
	updateStatus("No response received from the server.");
	return;
    }

    var numResults = data['result'].length;

    if (numResults == 0) {
	displayResults("No results match your query.");
	return;
    }

    for (var i = 0; i < numResults; ++i) {
	if (entities[i]['location']) {
	    var parts = entities[i]['location'].split(': ', 2);
	    if (parts[1] != null) {
		// Only consider the entities with coordinates.
		var lat_lon = parts[1].split(',');
		if (lat_lon.length == 2) {
		    entities[i]['latitude'] = lat_lon[0];
		    entities[i]['longitude'] = lat_lon[1];
		    _listings.push(entities[i]);
		}
	    }
	} else {
	    updateStatus("Could not parse results.");
	}
    }

    displayResults("Recent tweets:");
}

// Resets the map and result table.
function reset() {
    _map.clearOverlays();
    $("#results").empty();
}

// Displays recent tweets.
function displayResults(status) {
    if (status) {
	updateStatus(status);
    }

    reset();

    // center on the first result
    if (_listings.length > 0) {
	_map.setCenter(new GLatLng(_listings[0]['latitude'],
				   _listings[0]['longitude']), 13);
    }
    for (var i = 0; i < _listings.length; ++i) {
	var lat = _listings[i]['latitude'];
	var lon = _listings[i]['longitude'];
	var from = _listings[i]['from_user'];
	var text = _listings[i]['text'];
	d = new Date();
	d.setTime(Date.parse(_listings[i]['created_at']));
	var time = d.toLocaleTimeString();
	var image = _listings[i]['profile_image_url'];
	var tweet = '[' + time + '] ' + from + ': ' + text;
	var maptext = '<img height="48" width="48" class="tweetimage" src="' +
	    image + '">' + '[' + time + ']<br>' + from + ': ' + text;
	addMapPoint(maptext, lat, lon);
	var resultRow = '<tr><td class="pic"><img height="48" width="48" '
	    + 'src="' + image + '"></td><td class="tweet">' + tweet + '</td>';
	$("#results").append(resultRow);
    }
}
