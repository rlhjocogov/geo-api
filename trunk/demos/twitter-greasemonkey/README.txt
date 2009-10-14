This demo is a simple Greasemonkey script that usese the TownMe GeoAPI (http://code.google.com/p/geo-api) to modify some pages on Twitter. It modifies pages in two ways:

1) Convert Place Names Into Canonical Locations
On pages that list tweets (ex. http://twitter.com/townmedemo), the script tries to do something similar to #hashtags for locations in the format of ::business-name. Given that the vast majority of tweets do not yet have a lat/lon annotation, the script assumes ('37.75647', '-122.421218'), which is at Ritual Roasters in San Francisco. So, if you have the script installed and have a tweet with something like ::Dosa, it will turn it into a link to Dosa Restaurant, which is close to the assumed lat/lon.

2) Convert Coordinates into Points of Interest
On twitter search pages (ex. http://search.twitter.com/search?q=+near%3A%22san+francisco%22+within%3A5mi), the script looks for locations that are in lat/lon. Given that this is a geo-constrained search, the proportion of tweets with a lat/lon is higher. For tweets that do have a lat/lon, the script finds the closest point of interest and adds a line showing the point of interest along with the entities that contain it. For example a tweet with a lat/lon of (37.756447,-122.415581) would have 'Dolores Park > Castro-Upper Market > San Francisco' added below it.
