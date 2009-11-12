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
var _zoom = 13;

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
    initLatLon();
    if (GBrowserIsCompatible()) {
	_map = new GMap2($("#map_canvas").get(0));
	_map.setCenter(new GLatLng($("#lat").val(), $("#lon").val()), _zoom);
	_map.addControl(new GLargeMapControl());
	GEvent.addListener(_map, "click", mapClick);
    }
    search();
}

// Initialize latitude/longitude from URL query parameters if present.
function initLatLon() {
  groups = window.location.search.match(/lat=([0-9.-]+)&lon=([0-9.-]+)/);
  if (groups && groups.length == 3) {
    $("#lat").val(groups[1]);
    $("#lon").val(groups[2]);
    _zoom = 16;
  }
}

// Add a point of interest to the map.
function addMapPoint(name, lat, lon) {
    var point = new GLatLng(lat, lon);
    if (GBrowserIsCompatible()) {
	_map.addOverlay(new GMarker(point));
    }
}

// Update the status line (e.g. searching, errors, etc.)
function updateStatus(status) {
    $("#status").text(status);
}

// Get parent locations (neighborhood, city, etc).
function getParents() {
    $.getJSON("http://api.geoapi.com/v1/parents" +
	      "?apikey=" + escape(_apikey) +
	      "&lat=" + escape(_lat) +
	      "&lon=" + escape(_lon) +
	      "&jsoncallback=?",
	      updateParents);
}

// Displays the parents of the current location.
function updateParents(data) {
    if (data['result'] == null) {
	updateStatus("Service temporarily unavailable, please try again " +
		     "later.");
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
    updateHeader(parentNames);
}

// Displays the current neighborhood and header links.
function updateHeader(parentNames) {
    var places = parentNames + ' Places';
    var checkinStream = 'Check-Ins Nearby';
    var checkinUrl = 'checkin.html?lat=' + _lat + '&lon=' + _lon;
    var checkinStreamUrl = 'checkin_stream.html?lat=' + _lat + '&lon=' + _lon;
    if (_mode == "checkin") {
	$("#parents").html(places + ' | <a href="' + checkinStreamUrl + '">' +
			   checkinStream + '</a>');
    } else {
	$("#parents").html('<a href="' + checkinUrl + '">' + places +
			   '</a> | ' + checkinStream);
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
    reset();
    _listings = {};
    _apikey = $("#apikey").val();
    var limit = $("#limit").val();
    var radius_in_meters = $("#radius").val();
    if (GBrowserIsCompatible()) {
	_map.setCenter(new GLatLng(_lat, _lon), 16);
    }

    getParents();

    $.getJSON("http://api.geoapi.com/v1/search" +
	      "?apikey=" + escape(_apikey) +
	      "&lat=" + escape(_lat) +
	      "&lon=" + escape(_lon) +
	      "&radius=" + escape(radius_in_meters) + "m" +
	      "&limit=" + escape(limit) +
	      "&jsoncallback=?",
	      buildListings);
}

// Parses JSON data from the GeoAPI to build a data structure with listing data.
function buildListings(data) {
    var entities = data['result'];
    if (entities == null) {
	updateStatus("Service temporarily unavailable, please try again " +
		     "later.");
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
    } else {
        displayCheckins("Check-Ins:");
    }
}

// Displays point of interest names and comments for recent checkins.
function displayCheckins(status) {
    reset();

    if (status) {
	updateStatus(status);
    }

    for (var guid in _listings) {
	var name = _listings[guid]['name'];
	var lat = _listings[guid]['lat'];
	var lon = _listings[guid]['lon'];
	var comments = _listings[guid]['comments'];
	if (!name || !comments || comments.length == 0) {
	    continue;
	}
	addMapPoint(name, lat, lon);
	for (var i = 0; i < comments.length; ++i) {
	    if (comments[i]) {
		$("#results").append(
		    '<tr><td class="poi">' +
			'<a href="http://geoapi.com/v1/e/' + guid + '">' +
			escapeHTML(name) + '</a></td><td class="comment">' +
			escapeHTML(comments[i]) + '</td></tr>');
	    }
	}
    }
}

// Resets the cursor, map, and result table.
function reset() {
    if (GBrowserIsCompatible()) {
	_map.clearOverlays();
    }
    $("#results").empty();
}

// Displays listings of points of interest and allow people to check in.
function displayResults(status) {
    reset();

    if (status) {
	updateStatus(status);
    }

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
    req = $.getJSON("http://api.geoapi.com/v1/e/" + guid +
		    "/userview/" + _userview + "?apikey=" + _apikey +
		    "&jsoncallback=?",
		    loadComments);

    function loadComments(data) {
	var entries = data['result']['entries'];
	_listings[guid]['comments'] = [];
	for (var i = 0; i < entries.length; ++i) {
	    _listings[guid]['comments'].push(entries[i]['data']['comment']);
	}
	displayCheckins("Check-Ins:");
    }
}

// Writes a new checkin comment to the API.
function checkin(guid) {
    // Append the new comment to the existing comments.
    var content = {'comment': $("#comment").val()};
    var contentJSON = JSON.stringify(content);
    
    $.getJSON("http://api.geoapi.com/v1/e/" + guid +
	      "/userview/" + _userview + "?apikey=" + _apikey +
	      "&set-content=" + escape(contentJSON) +
	      "&jsoncallback=?",
	      completeCheckin);

    function completeCheckin(data) {
	$("#checkin_" + guid).text("Checked in");
    }
}
