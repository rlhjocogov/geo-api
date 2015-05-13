# Simple Search #

Method to perform a simple point/radius search for entities around a specific point. Entities can only be constrained by type and are sorted by distance from the center.

## URL ##

```
http://api.geoapi.com/v1/search
```

## Parameters ##

  * GlobalParameters
  * **lat**:
    * Required.
    * Description: Decimal latitude for search.
    * Format: Positive or negative floating point number (ex. 37.75647)
  * **lon**:
    * Required.
    * Description: Decimal longitude for search.
    * Format: positive or negative floating point number (ex. -122.421218)
  * **radius**:
    * Optional.
    * Description: Search radius.
    * Format: Floating point number followed by unit abbreviation (ex. 0.1km).
  * **type**:
    * Optional.
    * Description: Entity type constraint.
    * Format: String. If you only want points of interest, set to 'POI'
  * **include-parents**:
    * Optional.
    * Description: Whether to include the parents of the returned entities.
    * Format: set to '1' if you want to include parents.
  * **limit**:
    * Optional.
    * Description: Max number of results to return.
    * Format: Positive integer. Default is 10 and maximum is 100.

## Example ##

**query**
```
http://api.geoapi.com/v1/search?lat=37.75647&lon=-122.421218&radius=0.1km&apikey=demo&pretty=1
```

**response**
```
{
  "query": {
    "params": {
      "lon": -122.421218, 
      "num-results": 10, 
      "lat": 37.75647, 
      "radius-in-meters": 100, 
      "type": "any", 
      "include-parents": false
    }, 
    "type": "search"
  }, 
  "result": [
    {
      "distance-in-meters": 0, 
      "guid": "ritual-coffee-roasters-san-francisco-ca-94110", 
      "meta": {
        "geom": {
          "type": "Point", 
          "coordinates": [
            -122.421218, 
            37.75647
          ]
        }, 
        "guid": "ritual-coffee-roasters-san-francisco-ca-94110", 
        "type": "business", 
        "name": "Ritual Coffee Roasters", 
        "views": [
          "listing"
        ]
      }
    }, 
    {
      "distance-in-meters": 7, 
      "guid": "nor-cal-refrigeration-san-francisco-ca-94110", 
      "meta": {
        "geom": {
          "type": "Point", 
          "coordinates": [
            -122.421211, 
            37.756405999999998
          ]
        }, 
        "guid": "nor-cal-refrigeration-san-francisco-ca-94110", 
        "type": "business", 
        "name": "Nor Cal Refrigeration", 
        "views": [
          "listing"
        ]
      }
    }, 
   ...
  ]
}
```