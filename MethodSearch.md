# Types of Search #

We currently support two styles of performing searches:
  * [Simple Search](http://code.google.com/p/geo-api/wiki/MethodSimpleSearch): Allows you to easily do a point/radius search for businesses and points of interest.
  * [MQL Search](http://code.google.com/p/geo-api/wiki/MethodMQLSearch): Allows you to perform more complex queries, by constraining results based on various properties, including ones in views.

**Note**: Both Simple Search and MQL search are accessed using the same url (`http://api.geoapi.com/v1/search`) - however, MQL search takes the search parameters in a single query parameter 'q' (i.e. `http://api.geoapi.com/v1/q?q=...`

## Usage Notes ##

  * results are sorted by distance relative to the specified lat/lon
  * a maximum of 100 results will be returned
  * the maximum radius is 1km by default and 2km if you are searching only for points of interests.

## Supported distance units ##

| unit | abbreviation |
|:-----|:-------------|
| foot | ft |
| kilometer | km |
| meter | m |
| mile | mi |
| yard | yd |

Below are some other distance units we support for fun. No guarantees about them working long-term, but we figured we'd try to make pirates, Brits, Indians, astronomers, statisticians and MIT students feel at home :).

| unit | abbreviation |
|:-----|:-------------|
| British foot | british\_ft |
| Indian yard | indian\_yd |
| Nautical Mile | nm |
| US survey foot | survey\_ft |
| Attoparsecs | attoparsec |
| Smoot | smoot |