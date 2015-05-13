**The GeoAPI exposes data in two ways: entities and views**

# Entities #

Entities are things in the world. Entities can be physical things (ex. a business, a statue or a park), as well as arbitrary demarcations (ex. a neighborhood or a school district). Each entity has:
  * name: entity name (ex. Ritual Roasters)
  * type: entity type (ex. listing). Currently supported types are listed below
  * geom: entity geometry as a valid geojson (see http://geojson.org/) object. Can be a single point (a statue) or a polygon (a park). Note that a common source of confusion with geojson is that it presents coordinates in the order `longitude, latitude` (ie. compatible with the more "natural" cartesian presentation of `x, y`)
  * guid: string that uniquely identifies an entity (ex. Ritual Roasters in San Francisco, CA has the ID ritual-coffee-roasters-san-francisco-ca-94110. This always means one thing, and is a permanent identifier of that business).
  * shorturl: short url at geo.am that redirects to the entity's page at http://geoapi.com/

The currently supported list of entity types are:

| city | over 20K US cities |
|:-----|:-------------------|
|neighborhood | US neighborhoods |
| business | 16+ million US businesses |
| POI | various points of interest such as the Golden Gate Bridge |
| intersections | 10+ million intersections |


# Views #

Views are collections of data about entities. The view data associated with a specific entity can be a blob containing arbitrary data. The data within a single view should follow a consistent format (most frequently a JSON-formatted string with a predefined list of attributes).

For a limited set of developers, we are offering the ability to have a custom writable view that allows you to associate data with entities. If you are interested in gaining access to a writable view, please [submit your information](http://spreadsheets.google.com/viewform?formkey=dGJscE5kWmc1ZjVDUzFQUW8yMmdNa0E6MA) and we'll try to accommodate your request.

The currently supported list of views are:
  * [listing](ViewListing.md): Listing information for business entities
  * [userview](ViewUser.md): Userviews that provides each api key with its own namespace
  * [twitter](ViewTwitter.md): Tweets in neighborhoods or close to business entities
  * [flickr](ViewFlickr.md): Flickr photos in city, neighborhood or close to business entities