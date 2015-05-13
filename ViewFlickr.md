## entity types ##
  * city
  * POI
  * neighborhood
  * business
  * intersection

**note**: for entities that are defined as a point (instead of a polygon), the API returns Flickr photos within 2 km.

## url ##
`http://api.geoapi.com/v1/e/<guid>/view/flickr`


## format ##
> Results are in the format of [Flickr's JSON Search API](http://www.flickr.com/services/api/flickr.photos.search.html).

## Example ##

**query**
```
http://api.geoapi.com:8080/e/ritual-coffee-roasters-san-francisco-ca-94110/view/flickr?apikey=demo&pretty=1
```

**response**
```
{
  "query": {
    "params": {
      "guid": "ritual-coffee-roasters-san-francisco-ca-94110", 
      "view": "flickr"
    }, 
    "type": "entity-view"
  }, 
  "result": [
    {
      "pathalias": "polvero", 
      "height_o": "2048", 
      "machine_tags": "", 
      "place_id": "KqHKyeqcBJWO_7bUCA", 
      "url_sq": "http://farm3.static.flickr.com/2803/4087660525_5dcbd3131b_s.jpg", 
      "media_status": "ready", 
      "originalformat": "jpg", 
      "o_height": "2048", 
      "owner": "38687875@N00", 
      "id": "4087660525", 
      "iconfarm": 1, 
      "lastupdate": "1257968532", 
      "title": "Day Three Hundred Twelve", 
      "woeid": "55970943", 
      "tags": "sanfrancisco sky me nikon sunday shoppingcart wideangle 365 missiondistrict cart rolling d3 featured dustindiaz strobist threelights sb900 dedfolio", 
      "datetaken": "2009-11-08 18:19:33", 
      "farm": 3, 
      "secret": "5dcbd3131b", 
      "ownername": "Dustin Diaz", 
      "latitude": 37.750853999999997, 
      "height_t": "100", 
      "accuracy": "16", 
      "isfamily": 0, 
      "o_width": "2048", 
      "ispublic": 1, 
      "height_sq": 75, 
      "views": "3958", 
      "isfriend": 0, 
      "datetakengranularity": "0", 
      "originalsecret": "aa500094db", 
      "dateupload": "1257734862", 
      "width_o": "2048", 
      "width_m": "500", 
      "license": "3", 
      "iconserver": "35", 
      "height_m": "500", 
      "url_t": "http://farm3.static.flickr.com/2803/4087660525_5dcbd3131b_t.jpg", 
      "url_s": "http://farm3.static.flickr.com/2803/4087660525_5dcbd3131b_m.jpg", 
      "longitude": -122.420514, 
      "server": "2803", 
      "url_o": "http://farm3.static.flickr.com/2803/4087660525_aa500094db_o.jpg", 
      "media": "photo", 
      "url_m": "http://farm3.static.flickr.com/2803/4087660525_5dcbd3131b.jpg", 
      "height_s": "240", 
      "width_t": "100", 
      "width_sq": 75, 
      "width_s": "240"
    }, 
    ...
  ]
}
```