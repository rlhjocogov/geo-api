// Copyright 2009 Mixer Labs.  All Rights Reserved.
//
// GeoAPI Flickr Demo.

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
    [ 'downtown-san-francisco-ca', "Downtown"],
    [ 'financial-district-san-francisco-ca', "Financial District"],
    [ 'haight-ashbury-san-francisco-ca', "Haight-Ashbury"],
    [ 'marina-san-francisco-ca', "Marina"],
    [ 'mission-san-francisco-ca', "Mission"],
    [ 'north-beach-san-francisco-ca', "North Beach"],
    [ 'outer-richmond-san-francisco-ca', "Outer Richmond"],
    [ 'outer-sunset-san-francisco-ca', "Outer Sunset"],
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
            '"><a class="neighborhood" href="#" onclick="requestPhotos(\'' +
            guid + '\')">' + escapeHTML(name) + '</a></td></tr>');
    }
}

function createMarker(point, text) {
    var marker = new GMarker(point);

    GEvent.addListener(marker, "click", function() {
	marker.openInfoWindowHtml('<div class="mapphoto">' + text + '</div>');
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

// Get photos near guid.
function requestPhotos(guid) {
    if (_guid == null) {
	// Get new photos every 10 minutes.
	setInterval(requestPhotosForCurrentNeighborhood, 10 * 60 * 1000);
    }
    _guid = guid;
    initNeighborhoods();
    requestPhotosForCurrentNeighborhood();
}

function requestPhotosForCurrentNeighborhood() {
    if (_guid == null) {
	return;
    }
    updateStatus("Searching...");
    _listings = [];
    _apikey = $("#apikey").val();

    $.getJSON("http://api.geoapi.com/v1/e/" + escape(_guid) +
	      "/view/flickr?apikey=" + escape(_apikey) +
	      "&jsoncallback=?",
	      showPhotos);
}

// Parses JSON data from the GeoAPI to build a data structure with listing data.
function showPhotos(data) {
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
	if (entities[i]['latitude']) {
	    // Only consider the entities with coordinates.
	    _listings.push(entities[i]);
	} else {
	    updateStatus("Could not parse results.");
	}
    }

    displayResults("Recently uploaded photos from Flickr:");
}

// Resets the map and result table.
function reset() {
    _map.clearOverlays();
    $("#results").empty();
}

// Displays recent photos.
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
	var from = _listings[i]['ownername'];
	var text = _listings[i]['title'];
	var time = _listings[i]['datetaken'];
	var tiny = _listings[i]['url_t'];
	var image = _listings[i]['url_s'];
	var caption = '[' + time + ']<br>' + from + '<br>' + text;
	var maptext = '<img class="tiny_photo" src="' + tiny + '">' + '[' +
	    time + ']<br>' + from + '<br>' + text;
	addMapPoint(maptext, lat, lon);
	var resultRow = '<tr><td class="pic"><img src="' + image +
	    '"></td><td class="caption">' + caption + '</td>';
	$("#results").append(resultRow);
    }
}
