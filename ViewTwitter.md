## entity types ##
  * intersections
  * neighborhoods
  * business

**note**: for entities that are defined as a point (instead of a polygon), the API returns Flickr photos within 1 km.

## url ##
`http://api.geoapi.com/v1/e/<guid>/view/twitter`


## format ##
> Results are in the format of [Twitter's JSON Search API](http://apiwiki.twitter.com/Twitter-Search-API-Method:-search).

## Example ##

**query**
```
http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/view/twitter?apikey=demo&pretty=1
```

**response**
```
{
  "query": {
    "params": {
      "guid": "ritual-coffee-roasters-san-francisco-ca-94110", 
      "view": "twitter"
    }, 
    "type": "entity-view"
  }, 
  "result": [
    {
      "iso_language_code": "en", 
      "text": "fired up on caffeine", 
      "created_at": "Thu, 12 Nov 2009 19:26:26 +0000", 
      "profile_image_url": "http://a3.twimg.com/profile_images/52568973/s907814_34585506_1293_normal.jpg", 
      "source": "&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;", 
      "location": "iPhone: 37.754241,-122.423147", 
      "from_user": "bailey_v", 
      "from_user_id": 153667, 
      "to_user_id": null, 
      "geo": null, 
      "id": 5657224157
    }, 
   ...
  ]
}
```