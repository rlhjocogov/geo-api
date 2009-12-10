// Copyright 2009 Mixer Labs.  All Rights Reserved.
//
// GeoAPI Show Twitter Empire Entities Demo.
//
// This demo displays entities created in the Twitter Empire demo.

var _tweets = [];
var _apikey;
var _map;
var _name = null;
var _guid = null;

google.load("maps", "2.x");
google.load("jquery", "1.3.1");

var APIHOST = "http://geoapi.com/v1";
var MAX_RECENT_ENTITIES = 100;
var recent_entities = null;
var _entity_centers = {};

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
    }
    $.getJSON(APIHOST + "/e/san-francisco-ca/userview/empire-entities?apikey=" +
	      escape(_apikey) + "&jsoncallback=?",
	      loadUserCreatedEntities);
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
            '"><a class="entity" href="#" onclick="getAndCenterEntity(\'' +
	    guid + '\')">' + escapeHTML(name) + '</a></td></tr>');
    }
}

function getRecentEntityData() {
    _entity_centers = {};
    for (var i = 0;
	 i < recent_entities.length && i < MAX_RECENT_ENTITIES;
	 ++i) {
	guid = recent_entities[i][0];
	getEntity(guid);
    }
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
    getRecentEntityData();
}

// Displays a tweet or point entity on the map.
function createMarker(point, text) {
    var marker = new GMarker(point);

    GEvent.addListener(marker, "click", function() {
	marker.openInfoWindowHtml('<div class="maptext">' + text + '</div>');
    });
    return marker;
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

function guidURL(guid) {
    return APIHOST + "/e/" + escape(guid) + "?apikey=" + escape(_apikey);
}

// Requests data about an entity from GeoAPI.
function getEntity(guid) {
    $.getJSON(guidURL(guid) + "&jsoncallback=?",
	      function(data) { showEntity(data, guid) });
}

// Requests data about an entity from GeoAPI.
function getAndCenterEntity(guid) {
    _guid = guid;
    _map.setCenter(_entity_centers[guid], 13);
    initRecentEntities();
}

function linkURL(guid, name) {
    if (!name) {
	name = guid;
    }
    return '<a href="' + guidURL(guid) + '&pretty=1">' + name + "</a>"
}

// Displays an entity on the map.
function showEntity(data, guid) {
    var center = null;
    if (data['result'] == null) {
	// Removes invalid entities from the list of recently created entities.
	var i = 0;
	while (i < recent_entities.length) {
	    if (recent_entities[i][0] == guid) {
		recent_entities.splice(i, 1);
	    } else {
		++i;
	    }
	}
	initRecentEntities();
	return;
    }
    if (!guid) {
	guid = data['query']['params']['guid'];
    }
    var name = data['result']['name'];
    var geom = data['result']['geom'];
    if (geom['type'] == 'Point') {
	var lon = geom['coordinates'][0];
	var lat = geom['coordinates'][1];
	addMapPoint(linkURL(guid, name), lat, lon);
	_entity_centers[guid] = new GLatLng(lat, lon);
    } else if (geom['type'] == 'Polygon') {
	var points = geom['coordinates'][0];
	var polypoints = [];
	for (var i = 0; i < points.length; ++i) {
	    polypoints.push(new GLatLng(points[i][1], points[i][0]));
	}
	var polygon =
	    new GPolygon(polypoints, "#f33f00", 3, 1, "#ff0000", 0.15);
	_map.addOverlay(polygon);
	_map.addOverlay(
	    createMarker(polygon.getBounds().getCenter(), linkURL(guid, name)));
	_entity_centers[guid] = polygon.getBounds().getCenter();
    }
    var numResults = data['result'].length;
}
