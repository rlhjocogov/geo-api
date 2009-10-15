// Copyright 2009 Mixer Labs.  All Rights Reserved.
//
// TownMe GeoAPI Check-In Demo.

var _userview = 'comments';
var _listings = {};
var _apikey;
var _lat;
var _lon;
var _map;
var _mode;  // "checkin" to let people check in, "view" to see recent checkins.

google.load("maps", "2.x");
google.load("jquery", "1.3.1");

// HTML escape a string.
function escapeHTML(s) {
    return s.split("&").join("&amp;").
	split("<").join("&lt;").split(">").join("&gt;");
}

// Initialize the map and the mode.
function init(mode) {
    _mode = mode;
    if (GBrowserIsCompatible()) {
	_map = new GMap2($("#map_canvas").get(0));
	_map.setCenter(new GLatLng($("#lat").val(), $("#lon").val()), 13);
	_map.addControl(new GLargeMapControl());
	GEvent.addListener(_map, "click", mapClick);
    }
}

// Add a point of interest to the map.
function addMapPoint(name, lat, lon) {
    var point = new GLatLng(lat, lon);
    _map.addOverlay(new GMarker(point));
}

// Update the status line (e.g. searching, errors, etc.)
function updateStatus(status) {
    $("#status").text(status);
}

// Get parent locations (neighborhood, city, etc).
function getParents() {
    $.getJSON("http://api.townme.com/v1/parents" +
	      "?apikey=" + escape(_apikey) +
	      "&lat=" + escape(_lat) +
	      "&lon=" + escape(_lon) +
	      "&jsoncallback=?",
	      updateParents);
}

// Displays the parents of the current location.
function updateParents(data) {
    if (data['result'] == null) {
	updateStatus("No response received from the server");
	return;
    }

    var parents = data['result']['parents']
    if (parents.length == 0) {
	displayResults("No results match your query.");
	return;
    }

    var parentNames = "";
    // The API returns parents from most to least specific.
    for (var i = parents.length - 1; i >= 0; --i) {
	var parent = parents[i]['meta']['name'];
	if (parent) {
	    parentNames += parent;
	}
	if (i > 0) {
	    parentNames += " - ";
	}
    }
    var places = parentNames + ' Places';
    var checkinStream = 'City Check-In Stream';
    if (_mode == "checkin") {
	$("#parents").html(places + ' | <a href="checkin_stream.html">' +
			   checkinStream + '</a>');
    } else {
	$("#parents").html('<a href="checkin.html">' + places + '</a> | ' +
			   checkinStream);
    }
}

// When a user clicks the map, get the lat/lon from the map and start a search.
function mapClick(overlay, latlng) {
    if (latlng) {
	_lat = latlng.lat();
	_lon = latlng.lng();
	$("#lat").val(_lat);
	$("#lon").val(_lon);
        searchWithLatLon();
    }
}

// Search using lat/lon from the form.
function search() {
    _lat = $("#lat").val();
    _lon = $("#lon").val();
    searchWithLatLon();
}

// Search using the lat/lon from _lat/_lon (normally set from the map).
function searchWithLatLon() {
    updateStatus("Searching...");
    _listings = {};
    _apikey = $("#apikey").val();
    var radius_in_meters = $("#radius").val();
    if (GBrowserIsCompatible()) {
	_map.setCenter(new GLatLng(_lat, _lon), 18);
    }

    getParents();

    $.getJSON("http://api.townme.com/v1/search" +
	      "?apikey=" + escape(_apikey) +
	      "&lat=" + escape(_lat) +
	      "&lon=" + escape(_lon) +
	      "&radius=" + escape(radius_in_meters) + "m" +
	      "&jsoncallback=?",
	      buildListings);
}

// Parses JSON data from the GeoAPI to build a data structure with listing data.
function buildListings(data) {
    var entities = data['result'];
    if (entities == null) {
	updateStatus("No response received from the server.");
	return;
    }

    var numResults = data['query']['params']['num-results'];

    if (numResults == 0) {
	displayResults("No results match your query.");
	return;
    }

    for (var i = 0; i < numResults; ++i) {
	var guid = entities[i]['guid'];
	if (guid) {
	    var distance = entities[i]['distance-in-meters'];
	    var name = entities[i]['meta']['name'];
	    var lat = entities[i]['meta']['geom']['coordinates'][1];
	    var lon = entities[i]['meta']['geom']['coordinates'][0];
	    _listings[guid] = {'distance': distance,
			       'lat': lat,
			       'lon': lon,
			       'name': name,
			       'comments': []};
	    if (_mode == "view") {
		getComments(guid);
	    }
	} else {
	    updateStatus("Could not parse results.");
	}
    }

    if (_mode == "checkin") {
	displayResults(
	    "Click on any of the places listed below to check in there:");
    }
}

// Displays point of interest names and comments for recent checkins.
function displayCheckins() {
    reset();

    for (var guid in _listings) {
	var name = _listings[guid]['name'];
	var lat = _listings[guid]['lat'];
	var lon = _listings[guid]['lon'];
	var comments = _listings[guid]['comments'];
	if (name && comments.length > 0) {
	    addMapPoint(name, lat, lon);
	}
	for (var i = 0; i < comments.length; ++i) {
	    if (name && comments[i]) {
		$("#results").append(
		    '<tr><td class="poi">' +
			'<a href="http://www.townme.com/' + guid + '">' +
			escapeHTML(name) + '</a></td><td class="comment">' +
			escapeHTML(comments[i]) + '</td></tr>');
	    }
	}
    }
}

// Resets the map and result table.
function reset() {
    _map.clearOverlays();
    $("#results").empty();
}

// Displays listings of points of interest and allow people to check in.
function displayResults(status) {
    if (status) {
	updateStatus(status);
    }

    reset();

    for (var guid in _listings) {
	var name = _listings[guid]['name'];
	var lat = _listings[guid]['lat'];
	var lon = _listings[guid]['lon'];
	if (name) {
	    addMapPoint(name, lat, lon);
	    var resultRow = '<tr><td class="poi"><a href="#' + guid +
		'" onclick="selectEntity(\'' + guid + '\')">' +
		escapeHTML(name) + '</a></td><td class="comment" id="checkin_' +
		guid + '">&nbsp;</td>';
	    $("#results").append(resultRow);
	}
    }
}

// Shows the check in comment field and button for a point of interest.
function selectEntity(guid) {
    $("#checkin_" + guid).html(
	'<form onsubmit="return false">' +
	    '<input id="comment" name="comment" type="text" size="30">' +
            '<input type="submit" value="Check In" onclick="checkin(\'' + guid +
	    '\')"></form>');
}

// Requests comments for a point of interest.
function getComments(guid) {
    // The callback is called by loadComments as callback(guid).
    req = $.getJSON("http://api.townme.com/v1/e/" + guid +
		    "/userview/" + _userview + "?apikey=" + _apikey +
		    "&jsoncallback=?",
		    loadComments);

    function loadComments(data) {
	_listings[guid]['comments'] = data['comments'];
	displayCheckins();
	updateStatus("Check-Ins:");
    }
}

// Writes a new checkin comment to the API.
function checkin(guid) {
    // Append the new comment to the existing comments.
    _listings[guid]['comments'].push($("#comment").val());
    var content = {'comments': _listings[guid]['comments']};
    var contentJSON = JSON.stringify(content);
    
    $.getJSON("http://api.townme.com/v1/e/" + guid +
	      "/userview/" + _userview + "?apikey=" + _apikey +
	      "&set-content=" + escape(contentJSON) +
	      "&jsoncallback=?",
	      completeCheckin);

    function completeCheckin(data) {
	$("#checkin_" + guid).text("Checked in");
    }
}
