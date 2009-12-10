// Copyright 2009 Mixer Labs.  All Rights Reserved.
//
// GeoAPI Entity Creation Demo.
//
// This code demonstrates several features of GeoAPI:
//   1. Reading and writing both point and polygon entities.
//   2. Reading and writing to a user view to track recently created entities.

var _tweets = [];
var _apikey;
var _map;
var _name = null;
var _guid = null;
var _poly = null;
var _poly_overlay = null;

google.load("maps", "2.x");
google.load("jquery", "1.3.1");

var APIHOST = "http://geoapi.com/v1";
var ENTITIES = [
    [ 'downtown-san-francisco-ca', "Downtown"],
    [ 'mission-san-francisco-ca', "Mission"],
    [ 'south-of-market-san-francisco-ca', "South Of Market"],
    [ 'user-demo-ZqGELixR', "MGopolis"],
    [ 'user-demo-wHaNqqCD', "Liz Lane"],
    [ 'user-demo-OaL7E9GP', "George's Gulch"],
    [ 'user-demo-juLu3vkf', "Marius's Manor"],
    [ 'user-demo-pkoqrqpA', "Othman's Obelisk"],
    [ 'user-demo-eX93l77M', "Dave's Domain"],
    [ 'user-demo-2EqlRQAh', "Tom's Town"],
    [ 'user-demo-NOL8c7jy', "Coleen's Corner"],
    [ 'user-demo-y9pGTeqe', "Elad's Eyrie"]
];
var MAX_RECENT_ENTITIES = 5;
var recent_entities = null;

// HTML escape a string.
function escapeHTML(s) {
    return s.split("&").join("&amp;").
	split("<").join("&lt;").split(">").join("&gt;");
}

// Initialize the map and the mode.
function init() {
    _apikey = $("#apikey").val();
    if (GBrowserIsCompatible()) {
	_map = new GMap2($("#map_canvas").get(0));
	_map.setCenter(new GLatLng($("#lat").val(), $("#lon").val()), 12);
	_map.addControl(new GLargeMapControl());
	GEvent.addListener(_map, "click", mapClick);
    }
    reset();
    initEntities();
    $.getJSON(APIHOST + "/e/san-francisco-ca/userview/empire-entities?apikey=" +
	      escape(_apikey) + "&jsoncallback=?",
	      loadUserCreatedEntities);
}

// Displays the list of pre-made entities.
function initEntities() {
    $("#entities").empty();
    for (var i = 0; i < ENTITIES.length; ++i) {
	guid = ENTITIES[i][0];
	name = ENTITIES[i][1];
	var tdClass = "";
	if (guid == _guid) {
	    tdClass = "selected_entity";
	}
	$("#entities").append(
	    '<tr><td class="' + tdClass +
            '"><a class="entity" href="#" onclick="getEntity(\'' +
	    guid + '\')">' + escapeHTML(name) + '</a></td></tr>');
    }
}

// Displays the list of recent user-created entities.
function initRecentEntities() {
    $("#recent_entities").empty();
    for (var i = 0;
	 i < recent_entities.length && i < MAX_RECENT_ENTITIES;
	 ++i) {
	guid = recent_entities[i][0];
	name = recent_entities[i][1];
	var tdClass = "";
	if (guid == _guid) {
	    tdClass = "selected_entity";
	}
	$("#recent_entities").append(
	    '<tr><td class="' + tdClass +
            '"><a class="entity" href="#" onclick="getEntity(\'' +
	    guid + '\')">' + escapeHTML(name) + '</a></td></tr>');
    }
    $("#recent_entities").append(
	'<tr><td class="' + tdClass +
            '"><a class="entity" href="show_all.html">' +
	    '<b>See more &raquo;</b></a></td></tr>');
}

// Parses JSON data about recently created entities and displays them.
function loadUserCreatedEntities(data) {
    var entries = data['result']['entries'];
    recent_entities = [];
    for (var i = 0; i < entries.length && i < MAX_RECENT_ENTITIES; ++i) {
	var entity = entries[i]['data'];
	recent_entities.push([entity['guid'], entity['name']]);
    }
    initRecentEntities();
}

// Displays a tweet or point entity on the map.
function createMarker(point, text) {
    var marker = new GMarker(point);

    GEvent.addListener(marker, "click", function() {
	marker.openInfoWindowHtml('<div class="maptweet">' + text + '</div>');
    });
    return marker;
}

// Users click on the map to create point and polygon entities.
function mapClick(overlay, latlng) {
    if (!latlng) {
	return;
    }
    if (!_poly) {
	_poly = [];
    }
    if (_poly_overlay) {
	_map.removeOverlay(_poly_overlay);
    }
    if (_poly.length == 0) {
	reset();
    }
    _poly.push(latlng);

    var icon = new GIcon();
    icon.image = "vertex.png";
    icon.iconSize = new GSize(10, 10);
    icon.iconAnchor = new GPoint(5, 5);
    icon.infoWindowAnchor = new GPoint(5, 2);

    var marker = new GMarker(latlng, icon)
    _map.addOverlay(marker);
    if (_poly.length == 1) {
	$("#add_entities").html(
	    '<a onclick="reset()" href="#">Clear points</a>' +
            '<div style="float:right">' +
	    'Name: <input id="entity_name" type="text" size="20"> ' +
	    '<a onclick="addEntity()" href="#" id="add_entity">Add Place</a>' +
            '</div>');
	// Clicking on the first point closes and creates a polygon.
	GEvent.addListener(marker, "click", closePolygon);
    } else if (_poly.length == 2) {
	$("#add_entities").html(
	    '<a onclick="reset()" href="#">Clear points</a><br>' +
            'Click another point on the map to create a polygon');
    } else {
	$("#add_entities").html(
	    '<a onclick="reset()" href="#">Clear points</a><br>' +
            'Click to add more points to the polygon, or click on the first ' +
	    'point to close the polygon');
    }
    _poly_overlay = new GPolyline(_poly, "#003ff3", 3, 1, "#0000ff", 0.2);
    _map.addOverlay(_poly_overlay);
}

// Returns a GEOS geom object for the current point or polygon.
function getGeom() {
    if (_poly.length == 1) {
	return pointGeom();
    } else {
	return polyGeom();
    }
}

// Returns a GEOS geom object for the current point.
function pointGeom() {
    return {"type": "Point", "coordinates": [_poly[0].lng(), _poly[0].lat()]}
}

// Returns a GEOS geom object for the current polygon.
function polyGeom() {
    var coords = [];
    for (var i = 0; i < _poly.length; ++i) {
	// GeoAPI expects points to be in (longitude, latitude) order.
	coords.push([_poly[i].lng(), _poly[i].lat()]);
    }
    return {"type": "Polygon", "coordinates": [coords]};
}

// Calls GeoAPI to create a new entity with a unique guid.
function addEntity() {
    _name = $("#entity_name").val();
    entity_data = {"name": _name, "geom": getGeom()};
    // Creates a new entity with a new guid.  To do this POST as an
    // ajax call, the document URL must have the same domain as
    // APIHOST.
    $.ajax({
	type: "POST",
	url: APIHOST + "/e/?apikey=" + escape(_apikey),
	data: JSON.stringify(entity_data),
	success: showNewPoly,
	error: function (XMLHttpRequest, textStatus, errorThrown) {
	    updateStatus(textStatus);
	},
	dataType: "json"
    });
}

// Displays the newly created polygon and adds it to recently created places.
function showNewPoly(data) {
    _poly = [];
    _guid = data['query']['params']['guid'];
    if (!_name) {
	_name = _guid;
    }
    recent_entities.unshift([_guid, _name]);
    initRecentEntities();
    showEntity(data);

    // We write recently created entities to a userview.
    $.ajax({
	type: "POST",
	url: APIHOST + "/e/san-francisco-ca/userview/empire-entities?apikey=" +
	    escape(_apikey),
	data: JSON.stringify({"guid": _guid, "name": _name}),
	dataType: "json"
    });
}

// Draws a complete polygon on the map and prompts the user to submit it.
function closePolygon() {
    $("#add_entities").html(
	'<a onclick="reset()" href="#">Clear points</a>' +
        '<div style="float:right">' +
	'Name: <input id="entity_name" type="text" size="20"> ' +
	'<a onclick="addEntity()" href="#" id="add_entity">Add Place</a>' +
        '</div>');
    // The last point in the polygon must be the same as the first point.
    _poly.push(_poly[0]);
    if (_poly_overlay) {
	_map.removeOverlay(_poly_overlay);
    }
    _poly_overlay = new GPolygon(_poly, "#003ff3", 3, 1, "#0000ff", 0.2);
    _map.addOverlay(_poly_overlay);
}

// Displays a tweet or point entity on the map.
function addMapPoint(text, lat, lon) {
    var point = new GLatLng(lat, lon);
    _map.addOverlay(createMarker(point, text));
}

// Update the status line (e.g. searching, errors, etc.)
function updateStatus(status) {
    $("#status").text(status);
}

// Requests data about an entity from GeoAPI.
function getEntity(guid) {
    _guid = guid;
    $.getJSON(APIHOST + "/e/" + escape(_guid) +
	      "?apikey=" + escape(_apikey) +
	      "&jsoncallback=?",
	      showEntity);
}

// Displays an entity on the map and requests tweets associated with it.
function showEntity(data) {
    if (data['result'] == null) {
	updateStatus("No response received from the server.");
	return;
    }
    reset();
    var name = data['result']['name'];
    var geom = data['result']['geom'];
    if (geom['type'] == 'Point') {
	var lon = geom['coordinates'][0];
	var lat = geom['coordinates'][1];
	addMapPoint(name, lat, lon);
	_map.setCenter(new GLatLng(lat, lon), 13);
    } else if (geom['type'] == 'Polygon') {
	var points = geom['coordinates'][0];
	var polypoints = [];
	for (var i = 0; i < points.length; ++i) {
	    polypoints.push(new GLatLng(points[i][1], points[i][0]));
	}
	var polygon = new GPolygon(polypoints, "#f33f00", 3, 1, "#ff0000", 0.2);
	_map.addOverlay(polygon);
	_map.setCenter(polygon.getBounds().getCenter(), 13);
    }
    var numResults = data['result'].length;
    initEntities();
    initRecentEntities();
    requestTweetsForCurrentEntity();
}

// Requests the GeoAPI twitter view for the currently selected entity.
function requestTweetsForCurrentEntity() {
    if (_guid == null) {
	return;
    }
    updateStatus("Searching...");
    _tweets = [];
    _apikey = $("#apikey").val();

    $.getJSON(APIHOST + "/e/" + escape(_guid) +
	      "/view/twitter?apikey=" + escape(_apikey) +
	      "&jsoncallback=?",
	      showTweets);
}

// Parses JSON data from the GeoAPI to build a data structure with tweet data.
function showTweets(data) {
    var tweets = data['result'];
    if (tweets == null) {
	updateStatus("No response received from the server.");
	return;
    }

    var numResults = data['result'].length;

    if (numResults == 0) {
	displayResults("No results match your query.");
	return;
    }

    for (var i = 0; i < numResults; ++i) {
	if (tweets[i]['location']) {
	    var parts = tweets[i]['location'].split(': ', 2);
	    if (parts[1] != null) {
		// Only consider the tweets with coordinates.
		var matches = /([0-9.-]+),([0-9.-]+)/.exec(parts[1]);
		if (matches != null && matches.length == 3) {
		    tweets[i]['latitude'] = matches[1];
		    tweets[i]['longitude'] = matches[2];
		    _tweets.push(tweets[i]);
		}
	    }
	} else {
	    updateStatus("Could not parse results.");
	}
    }

    displayResults("Recent tweets near your place or within your polygon:");
}

// Resets the map and result table.
function reset() {
    _map.clearOverlays();
    $("#status").html("&nbsp;");
    $("#results").empty();
    $("#add_entities").html("&nbsp;");
    _poly = [];
}

// Displays recent tweets.
function displayResults(status) {
    if (status) {
	updateStatus(status);
    }

    for (var i = 0; i < _tweets.length; ++i) {
	var lat = _tweets[i]['latitude'];
	var lon = _tweets[i]['longitude'];
	var from = _tweets[i]['from_user'];
	var text = _tweets[i]['text'];
	d = new Date();
	d.setTime(Date.parse(_tweets[i]['created_at']));
	var time = d.toLocaleTimeString();
	var image = _tweets[i]['profile_image_url'];
	var tweet = '[' + time + '] ' + from + ': ' + text;
	var maptext = '<img height="48" width="48" class="tweetimage" src="' +
	    image + '">' + '[' + time + ']<br>' + from + ': ' + text;
	addMapPoint(maptext, lat, lon);
	var resultRow = '<tr><td class="pic"><img height="48" width="48" '
	    + 'src="' + image + '"></td><td class="tweet">' + tweet + '</td>';
	$("#results").append(resultRow);
    }
}
