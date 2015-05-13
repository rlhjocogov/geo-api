User Views work exactly like regular views such as listing. However, they are in a private namespace, which allows developers to annotate any entity with their own data. Developers can write data to a custom view by POST'ing information (in JSON format) to a named view of any entity (the view is associated with an API key, and not viewable or writable with other API keys).

## entity types ##
  * all entities

## url ##
`http://api.geoapi.com/v1/e/<guid>/userview/<view>`

**Note**: The apikey query parameter namespaces userviews. So, a view called 'mydata' for key1 is entirely different from a view called 'mydata' for key2.

## writing to a view ##

Important details about writing to a userview:
  * Namespace: views are namespaced by api keys
  * Method: userviews are written either using a POST, where the body of the POST is the data to be posted OR using a GET, with a "set-content" parameter.
  * Format: data is required to be in JSON format - if the JSON doesn't validate, an error will be returned.
  * Versioning: Userviews are **APPEND-ONLY**, meaning that entries are timestamped. You can filter for specific dates and ranges using [MQL Search](MethodMQLSearch.md).

For example, if you have a custom view called 'monsters-in-town' and you want to associate information about a monster in Ritual Roasters, you would POST to

```
http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/userview/monsters-in-town?apikey=demo
```
> with some data - for example:
```
{monsters: [
	{name: 'Zombie Fixie Rider',
	 creator: 'hipsternaut'
	 eats: ['nerds']
	}]
}
```
> you would have:
```
{
 "query": {
   "params": {
     "userview": "bar",
     "guid": "ritual-coffee-roasters-san-francisco-ca-94110"
   },
   "type": "entity-view"
 },
 "result": {
   "entries": [
     {
       "date": "2009-11-12T18:55:26Z",
       "data": {
         "two": "is-unindexed",
         "one": "some- value"
       },
       "id": "QPyouiLp"
       }
   ]
 }
}

```


## Parameters ##

  * GlobalParameters
  * **set-content**:
    * Required for writing using GET, unnecessary for POST.
    * Description: data to write to the custom view.
    * Format: any string.


## Indexing ##
Developers can requests that fields in their custom views be indexed. This is done by calling an "options" method. Once a field is indexed, it then becomes possible to use MQL queries that constrain on that property.

For example:
To request that field 'one' in the 'bar' view be indexed as a string, you would call:
```
curl --data-binary '{"fields": {"one": {"index-as": "string"}}}'
"http://localhost:8888/options/userview/bar?apikey=demo"
```

You would write to that view with:
```
curl --data-binary '{"one": "some- value", "two": "is-unindexed"}'
"http://localhost:8888/e/ritual-coffee-roasters-san-francisco-ca-94110/userview/bar?apikey=demo"
```

And then, if you make an MQL Search query to `http://localhost:8888/e/ritual-coffee-roasters-san-francisco-ca-94110/userview/bar` with the q parameter as:
```
{
 "lat": 37.75629
 "lon": -122.4213
 "radius": "0.2km"
 "entity": [{
   "type": "business"
   "userview.bar": {
     "entries": [{
       "data": {
         "one": "some- value"
       }
     }]
   }
 }]
}
```
you would receive a response such as:
```
{
 "lat": 37.75629,
 "lon": -122.4213,
 "radius": "0.2km",
 "entity": [
   {
     "userview.bar": {
       "entries": [
         {
           "data": {
             "one": "some- value"
           }
         },
         {
           "data": {
             "one": "some- value"
           }
         }
       ]
     },
     "type": "business"
   }
 ]
}
```