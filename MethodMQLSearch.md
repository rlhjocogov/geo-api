# MQL search #


Method to search entities using the [Metaweb Query Language](http://www.freebase.com/view/en/documentation) (MQL). This is the more powerful way to search for entities, as it allows developers to express constraints on properties of entities, **including values contained in views**.

**Getting Started**: We recommend that you first take a look at the [MQL Reference Guide](http://download.freebase.com/MQLReferenceGuide.pdf) and [MQL Cheat Sheet](http://download.freebase.com/MQLcheatsheet-081208.pdf) to get an idea of how MQL works.

## URL ##

```
http://api.geoapi.com/v1/q
```

## Parameters ##

  * GlobalParameters
  * **q**:
    * Required.
    * Description: MQL query specifying search constraints.
    * Format: MQL syntax (examples below)


## General Idea ##
The idea behind the MQL search interface is that you provide a query in similar format as the response, where you specify properties you want to constrain by setting their values and properties that you want to be returned by specifying their values as 'null'.

For example, to express that you want the names and prices of all menu items that are of type 'dessert', you could have the following:
```
{
  "menu_item": [{
    "name": null,
    "price": null,
    "type": "dessert"
  }]
}
```

## GeoAPI Queries ##
Geo search queries follow the pattern below:
```
{
  "lat": <lat>,
  "lon": <lon>,
  "radius": <radius>,
  "limit": <limit>,
  "entity": [{
    <entity_property_1>,
    <entity_property_2>,
    ...,
    "view.<view_name>": {
      <view_property_1>,
      <view_property_2>,
      ...
    }
  }]
}
```

**Field explanation**
  * `<lat>`:
    * Required.
    * Description: Decimal latitude for search.
    * Format: Positive or negative floating point number (ex. 37.75647)
  * `<lon>`:
    * Required.
    * Description: Decimal longitude for search.
    * Format: positive or negative floating point number (ex. -122.421218)
  * `<radius>`:
    * Required.
    * Description: Search radius.
    * Format: Floating point number followed by unit abbreviation (ex. 0.1km). Supported units listed below. The default radius is 500m and the maximum radius is 1km (2km if you constrain type to POI).
  * `<limit>`:
    * Optional.
    * Description: Max number of results to return.
    * Format: Positive integer. Default is 10 and maximum is 100.
  * `<entity_property>`
    * Optional
    * Description: Any number of entity properties. Specifying a value for an property constrains the search. Specifying a `null` value causes the property to be returned.
    * Format: The full list of property is listed at the root url of an entity (ex. [http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110](http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110?apikey=demo&pretty=1)).
  * `<view_name>`
    * Optional
    * Description: Specifying a view allows you to filter based on its values and/or get back those values for returned entities.
    * Format: Name of a view. Currently supported views are 'listing' and user-defined views.
  * `<view_property>`
    * Optional
    * Description: Any number of view properties. Specifying a value for an property constrains the search. Specifying a `null` value causes the property to be returned.
    * Format: Valid property names for the specified view. For example, for the 'listing' view, the possible properties can be seen on the view results for an entity (ex. [http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/view/listing](http://api.geoapi.com/v1/e/ritual-coffee-roasters-san-francisco-ca-94110/view/listing?apikey=demo&pretty=1))

## Constraining Properties ##
_Properties can be constrained using several standard MQL operators. They way you constrain a property (i.e. filter by a specific value) is by specifying that property and the value by which you want it filtered. The list of supported operators are below._
  * **equality** - [MQL doc](http://mql.freebaseapps.com/ch03.html#operators)
    * ex: `"name": "Tartine"` name is required to be equal to "Tartine".
  * **inequality** ("but not" operator) - [MQL doc](http://mql.freebaseapps.com/ch03.html#butnotoperator)
    * `"name!=":"Tartine"` name can be anything but "Tartine" (including null).
  * **less than** - [MQL doc](http://mql.freebaseapps.com/ch03.html#numericconstraints)
    * `"score<":6` score only be less than 6.
  * **greater than** - [MQL doc](http://mql.freebaseapps.com/ch03.html#numericconstraints)
    * `"score>":6` score only be greater than 6.
  * **prefix** - [MQL doc](http://mql.freebaseapps.com/ch03.html#matchsyntax)
    * `"name^=": "The"` name is required to start with "The".
    * **Note that our syntax here is slightly different than MQL - instead of having a regex operator, we have an explicit prefix operator (^).**
**IMPORTANT NOTE**: You can constrain results **only** based on indexed properties. At this time, the indexed properties are:
  * view.listing/name
  * view.listing/verticals
  * view.listing/features
  * view.listing/web-wide-rating

## Requesting Properties ##
_Properties can be requested (from entities or views) by specifying the property name and 'null' as its value. You can request all properties of an entity or view by passing in a wildcard._
  * **property to request** - [MQL doc](http://mql.freebaseapps.com/ch03.html#mqlids)
    * `"name": null` Fill in the name property in the response.
  * **wildcards** [MQL doc](http://mql.freebaseapps.com/ch03.html#wildcards)
    * `"*": null` Return all properties.

## Examples ##

You can experiment with different queries using our handy [query tool](http://api.geoapi.com/demos/mql_tool/query.html) (which is also a demo).

Below are several examples of MQL queries. Note that the queries are of the following format: `http://api.geoapi.com/v1/search?&apikey=demo&q=<query>`, however in the examples below, we'll only be showing the 'q' parameter, as that parameterizes the entire query.

### Radius search for businesses that are both restaurants and coffee houses, with only some properties requested ###
**query**
```
{
  "lat": 37.75629
  "lon": -122.4213
  "radius": "0.2km"
  "entity": [{
    "guid": null
    "type": "business"
    "view.listing": {
      "a:verticals": "restaurants"
      "b:verticals": "food-and-drink:coffee-houses"
      "address": []
      "name": null
    }
  }]
}
```


**response**
```
{
  "lat":37.75629,
  "lon":-122.4213,
  "radius":"0.2km",
  "entity":[{
      "view.listing":{
        "address":["1026 Valencia St",
          "San Francisco",
          "94110"
        ],
        "name":"Ritual Coffee Roasters",
        "b:verticals":"food-and-drink:coffee-houses",
        "a:verticals":"restaurants"
      },
      "guid":"ritual-coffee-roasters-san-francisco-ca-94110",
      "type":"business"
    },
    {
      "view.listing":{
        "address":["968 Valencia St",
          "San Francisco",
          "94110"
        ],
        "name":"The Creek Cafe",
        "b:verticals":"food-and-drink:coffee-houses",
        "a:verticals":"restaurants"
      },
      "guid":"the-creek-cafe-san-francisco-ca-94110",
      "type":"business"
    },
    {
      "view.listing":{
        "address":["1109 Valencia St",
          "San Francisco",
          "94110"
        ],
        "name":"Cafe Valencia",
        "b:verticals":"food-and-drink:coffee-houses",
        "a:verticals":"restaurants"
      },
      "guid":"cafe-valencia-san-francisco-ca-94110",
      "type":"business"
    },
    {
      "view.listing":{
        "address":["3248 22nd St",
          "San Francisco",
          "94110"
        ],
        "name":"Revolution Cafe",
        "b:verticals":"food-and-drink:coffee-houses",
        "a:verticals":"restaurants"
      },
      "guid":"revolution-cafe-san-francisco-ca-94110",
      "type":"business"
    },
    {
      "view.listing":{
        "address":["3239 22nd St",
          "San Francisco",
          "94110"
        ],
        "name":"La Altena Market & Cafe",
        "b:verticals":"food-and-drink:coffee-houses",
        "a:verticals":"restaurants"
      },
      "guid":"la-altena-market-and-cafe-san-francisco-ca-94110",
      "type":"business"
    }
  ]
}
```

### Radius search for businesses that are both restaurants and coffee houses, with all of the listing view data ###
**query**
```
{
  "lat": 37.75629
  "lon": -122.4213
  "radius": "0.2km"
  "entity": [{
    "guid": null
    "type": "business"
    "view.listing": {
      "a:verticals": "restaurants"
      "b:verticals": "food-and-drink:coffee-houses"
      "*": null
    }
  }]
}
```


**response**
```
{
  "lat":37.75629,
  "lon":-122.4213,
  "radius":"0.2km",
  "entity":[{
      "view.listing":{
        "hours":[["Mon to Fri",
            "6:00am to 10:00pm",
            ""
          ],
          ["Sat",
            "7:00am to 10:00pm",
            ""
          ],
          ["Sun",
            "7:00am to 9:00pm",
            ""
          ]
        ],
        "web-wide-rating":4,
        "features":["Credit Card OK",
          "Price: Cheap"
        ],
        "chain":null,
        "address":["1026 Valencia St",
          "San Francisco",
          "94110"
        ],
        "canonical-url":"http://www.townme.com/ritual-coffee-roasters-san-francisco-ca-94110",
        "verticals":["food-and-drink:coffee-houses",
          "restaurants"
        ],
        "phone":"(415) 641-1024",
        "a:verticals":"restaurants",
        "b:verticals":"food-and-drink:coffee-houses",
        "sips":["soy latte",
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
        "listing-url":"http://www.ritualroasters.com",
        "name":"Ritual Coffee Roasters"
      },
      "guid":"ritual-coffee-roasters-san-francisco-ca-94110",
      "type":"business"
    },
    {
      "view.listing":{
        "hours":null,
        "web-wide-rating":3.5,
        "features":["Credit Card OK",
          "Outdoor Seating",
          "Price: Cheap"
        ],
        "chain":null,
        "address":["968 Valencia St",
          "San Francisco",
          "94110"
        ],
        "canonical-url":"http://www.townme.com/the-creek-cafe-san-francisco-ca-94110",
        "verticals":["food-and-drink:coffee-houses",
          "restaurants"
        ],
        "phone":"(415) 641-0888",
        "a:verticals":"restaurants",
        "b:verticals":"food-and-drink:coffee-houses",
        "sips":["ritual",
          "power outlets",
          "laptop",
          "free wifi",
          "bagel",
          "mission",
          "wireless",
          "study",
          "coffee shop",
          "plugs"
        ],
        "listing-url":null,
        "name":"The Creek Cafe"
      },
      "guid":"the-creek-cafe-san-francisco-ca-94110",
      "type":"business"
    },
...
```

### All views for an entity constrained by name ###
**query**
```
{
  "lat": 37.75629
  "lon": -122.4213
  "radius": "0.2km"
  "entity": [{
    "*": null
    "type": "business"
    "view.listing": {
      "name": "Ritual Coffee Roasters"
    }
  }]
}
```
**note**: lat/lon parameters are always required even if a guid is specified.

**response**
```
{
  "lat":37.75629,
  "lon":-122.4213,
  "radius":"0.2km",
  "entity":[{
      "bearing-from-center":"65.5081",
      "view.listing":{
        "hours":[["Mon to Fri",
            "6:00am to 10:00pm",
            ""
          ],
          ["Sat",
            "7:00am to 10:00pm",
            ""
          ],
          ["Sun",
            "7:00am to 9:00pm",
            ""
          ]
        ],
        "web-wide-rating":4,
        "features":["Credit Card OK",
          "Price: Cheap"
        ],
        "chain":null,
        "address":["1026 Valencia St",
          "San Francisco",
          "94110"
        ],
        "canonical-url":"http://www.townme.com/ritual-coffee-roasters-san-francisco-ca-94110",
        "verticals":["food-and-drink:coffee-houses",
          "restaurants"
        ],
        "phone":"(415) 641-1024",
        "sips":["soy latte",
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
        "listing-url":"http://www.ritualroasters.com",
        "name":"Ritual Coffee Roasters"
      },
      "distance-from-origin":"21m",
      "name":"Ritual Coffee Roasters",
      "views":["twitter",
        "listing"
      ],
      "geom":{
        "type":"Point",
        "coordinates":[-122.421218,
          37.75647
        ]
      },
      "view.twitter":[{
          "iso_language_code":"en",
          "text":"We have a new art exhibit @ dolores!  Opening party tomorrow.  bring your friends.  Come early for happy hour and... http://bit.ly/m5nBR",
          "created_at":"Thu, 12 Nov 2009 18:16:22 +0000",
          "profile_image_url":"http://a3.twimg.com/profile_images/369921759/dpc_normal.jpg",
          "source":"&lt;a href=&quot;http://www.facebook.com/twitter&quot; rel=&quot;nofollow&quot;&gt;Facebook&lt;/a&gt;",
          "location":"iPhone: 37.761433,-122.425705",
          "from_user":"DoloresParkCafe",
          "from_user_id":22849005,
          "to_user_id":null,
          "geo":null,
          "id":5655576595
        },
        ...
      ],
      "guid":"ritual-coffee-roasters-san-francisco-ca-94110",
      "type":"business"
    }
  ]
}
```