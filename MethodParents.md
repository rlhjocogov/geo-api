# parents (root method) #

Method to find the parents of a specific points (ex. point (x, y) is in Mission District > San Francisco > California)

## URL ##

```
http://api.geoapi.com/v1/parents
```

## Parameters ##

  * GlobalParameters
  * **lat**:
    * Required.
    * Description: Latitude for search.
    * Format: Positive or negative floating point number (ex. 37.75647)
  * **lon**:
    * Required.
    * Longitude for search.
    * Format: positive or negative floating point number (ex. -122.421218)

## Example ##

**query**
```
http://api.geoapi.com/v1/parents?lat=37.563474999999997&lon=-122.32321899999999&apikey=demo&pretty=1
```

**response**
```
{
  "query": {
    "params": {
      "lat": 37.563474999999997, 
      "lon": -122.32321899999999
    }, 
    "type": "point-parents"
  }, 
  "result": {
    "parents": [
      {
        "guid": "downtown-san-mateo-ca", 
        "meta": {
          "geom": {
            "type": "Polygon", 
            "coordinates": [...]
          }, 
          "guid": "downtown-san-mateo-ca", 
          "type": "neighborhood", 
          "name": "Downtown", 
          "views": []
        }
      }, 
      {
        "guid": "san-mateo-ca", 
        "meta": {
          "geom": {
            "type": "Polygon", 
            "coordinates": [...]
          }, 
          "guid": "san-mateo-ca", 
          "type": "city", 
          "name": "San Mateo", 
          "views": []
        }
      }
    ]
  }
}
```

# parents (guid method) #

Method to find the parents of a specific points (ex. Ritual Roasters is in Mission District > San Francisco > California)

## URL ##

```
http://api.geoapi.com/v1/e/<guid>/parents
```
`<guid>: Any valid GeoAPI guid`

## Parameters ##

  * GlobalParameters

## Example ##

**query**
```
http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/parents?apikey=demo&pretty=1
```

**response**
```
{
  "query": {
    "params": {
      "guid": "ritual-coffee-roasters-san-francisco-ca-94110"
    }, 
    "type": "entity-parents"
  }, 
  "result": {
    "parents": [
      {
        "guid": "mission-san-francisco-ca", 
        "meta": {
          "geom": {
            "type": "Polygon", 
            "coordinates": [...]
          }, 
          "guid": "mission-san-francisco-ca", 
          "type": "neighborhood", 
          "name": "Mission", 
          "views": []
        }
      }, 
      {
        "guid": "san-francisco-ca", 
        "meta": {
          "geom": {
            "type": "MultiPolygon", 
            "coordinates": [...]
          }, 
          "guid": "san-francisco-ca", 
          "type": "city", 
          "name": "San Francisco", 
          "views": []
        }
      }
    ]
  }
}
```