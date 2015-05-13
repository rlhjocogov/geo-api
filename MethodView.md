# view #

## URL ##

```
http://api.geoapi.com/v1/e/<guid>/view/<view>
```
`<guid>: Any valid GeoAPI guid`
`<view>: A valid GeoAPI view for the given guid.` ([currently supported views](KeyConcepts#Views.md))

## Parameters ##

  * GlobalParameters

## Example ##

**query**
```
http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/view/listing?apikey=demo&pretty=1
```

**response**
```
{
  "query": {
    "params": {
      "guid": "ritual-coffee-roasters-san-francisco-ca-94110", 
      "view": "listing"
    }, 
    "type": "entity-view"
  }, 
  "result": {
    "hours": [
      [
        "Mon to Fri", 
        "6:00am to 10:00pm", 
        ""
      ], 
      [
        "Sat", 
        "7:00am to 10:00pm", 
        ""
      ], 
      [
        "Sun", 
        "7:00am to 9:00pm", 
        ""
      ]
    ], 
    "features": [
      "Credit Card OK", 
      "Price: Cheap"
    ], 
    "chain": null, 
    "address": "1026 Valencia St, San Francisco CA 94110", 
    "canonical-url": "http://www.townme.com/ritual-coffee-roasters-san-francisco-ca-94110", 
    "verticals": [
      "food-and-drink:coffee-houses", 
      "restaurants"
    ], 
    "phone": "(415) 641-1024", 
    "world-wide-rating": 4.0, 
    "sips": [
      "soy latte", 
      "espresso", 
      "hipsters", 
      "blue bottle", 
      "mission", 
      "coffee shop", 
      "baristas", 
      "cappuccino", 
      "outlets", 
      "foam"
    ], 
    "listing-url": "http://www.ritualroasters.com", 
    "name": "Ritual Coffee Roasters"
  }
}
```

## Usage Notes ##

  * Response formats are view-specific. In most cases, these will be JSON-formatted strings.
  * A guid/view combination that does not exist will return a 404

# Writing to a custom-writeable view #

You can write data to a custom view by POST'ing information to a named view of any entity (the view is associated with your API key, and not viewable or writable with other API keys). For example, if you have a custom view called 'monsters-in-town' and you want to associate information about a monster in Ritual Roasters, you would POST to

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

Writing to a view overwrites its contents. You can fetch a view like any system view, the results will be returned verbatim.

The API also supports GET for writing to a view using the "set-content" parameter. Example:

```
http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/userview/monsters-in-town?apikey=demo&set-content=I%20like%20coffee
```


## Parameters ##

  * GlobalParameters
  * **set-content**:
    * Required for writing using GET, unnecessary for POST.
    * Description: data to write to the custom view.
    * Format: any string.