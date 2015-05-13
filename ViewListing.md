## entity types ##
  * business

## url ##
`http://api.townme.com/v1/e/<guid>/view/listing`


## properties ##
  * name: Business name
  * address: Business address
  * canonical-url: Canonical TownMe url
  * listing-url: Business url
  * hours: Hours of operation (array of tuples `[days, hours, type]`)
  * verticals: Business categories (array of canonical business types)
  * features: Business features - possible values are:
    * Alcohol
    * Credit Card OK
    * Delivery
    * Noise: Quiet
    * Noise: Loud
    * Open Late
    * Outdoor Seating
    * Parking
    * Price: Cheap
    * Price: Moderate
    * Price: Expensive
    * Romantic
  * chain: business chain (ex. jamba-juice)
  * phone: Phone number (format is (xxx) xxx-xxxx)
  * web-wide-rating: Aggregate web-wide TownMe rating (out of 5.0)
  * sips: Statistically Improbably Phrases (ex. "hipsters" for Ritual Roasters in San Francisco). These are phrases/words we think are unique/interesting for that business.

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
    "web-wide-rating": 4.0, 
    "features": [
      "Credit Card OK", 
      "Price: Cheap"
    ], 
    "chain": null, 
    "address": [
      "1026 Valencia St", 
      "San Francisco", 
      "94110"
    ], 
    "canonical-url": "http://www.townme.com/ritual-coffee-roasters-san-francisco-ca-94110", 
    "verticals": [
      "food-and-drink:coffee-houses", 
      "restaurants"
    ], 
    "phone": "(415) 641-1024", 
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