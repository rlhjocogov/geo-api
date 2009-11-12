This demo is a simple Greasemonkey script that uses the GeoAPI (http://code.google.com/p/geo-api) to modify some pages on Twitter. To try out this demo, Install Greasemonkey and install the script at: http://geo-api.googlecode.com/svn/trunk/demos/twitter-greasemonkey/twitter-local.user.js


This demo modifies pages in two ways:
1) Convert Place Names Into Canonical Locations
On pages that list tweets (ex. http://twitter.com/geoapidemo), the script tries to do something similar to #hashtags for locations in the format of ::business-name. Given that the vast majority of tweets do not yet have a lat/lon annotation, the script assumes ('37.75647', '-122.421218'), which is at Ritual Roasters in San Francisco. So, if you have the script installed and have a tweet with something like ::Dosa, it will turn it into a link to Dosa Restaurant, which is close to the assumed lat/lon.

2) Convert Coordinates into Neighborhoods
On twitter search pages (ex. http://search.twitter.com/search?q=+near%3A%22san+francisco%22+within%3A5mi), the script looks for locations that are in lat/lon. Given that this is a geo-constrained search, the proportion of tweets with a lat/lon is higher. For tweets that do have a lat/lon, the script finds the containing neighborhood and adds a line showing the neighborhood. For example a tweet with a lat/lon of (37.756447,-122.415581) would have 'Castro-Upper Market' added below it.
