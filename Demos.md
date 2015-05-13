To show off some of the cool stuff that can be done with the GeoAPI, we have pulled together a few quick demos.  These demos were pulled together very fast (i.e. a day or work or less for each, so full disclaimers apply).

# Demo 1: Location Check-Ins #

A number of social location broadcast apps have launched in the last year.  The GeoAPI makes it easy to build a similar application.  In this demo, you can chose a lat/long on a map by clicking on the map (or, similarly, an iphone or android device can pass a lat/long in a related fashion).  In reply to the coordinates the API returns a set of businesses which a user can click on to "check in" and then annotate with a comment.  These comments get published into the writable part of the API which is then accessed by the user to see
what comments people posted in the area while checking in.

This means anyone can now much more easily write either (a) a location broadcast app or (b) an augmented reality app, where e.g. a pot of gold could be stored by a user at Starbucks, and this location annotation could be stored as a layer in our system via the API.

**Key point**
This is an all javascript demo from the developer perspective.  We are not only **reading** locations from the API, but also literally **writing** information onto the GeoAPI servers to the unique virtual overlay or layer each API key comes with.  This is a unique aspect of this API - the ability to write your own virtual overlay of the world (or at least the parts of the world we currently support)

**How to try it out:**
  * Go to: http://geoapi.com/demos/checkin-stream/checkin.html
  * Click on a location on the map.  A set of nearby POI/businesses will populate.
  * Click on the link for any of these points and add a comment.
  * Click on "Check-ins Nearby" page and click on the map to see nearby checkins/comments that have occurred.
  * **IMPORTANT** If there are no check-ins on the "check-ins nearby" page the page will be blank.  So you need to toggle back to "San Francisco locations" and then click on the map to see additional places to check in.

**Source Code:** http://code.google.com/p/geo-api/source/browse/#svn/trunk/demos/checkin-stream

![http://blog-media.townme.com/checkindemo_final-small.png](http://blog-media.townme.com/checkindemo_final-small.png)

# Demo 2: Annotation of Twitter Streams with Locations #

Some tweets are annotated with locations in the form of lat/lons.  The coordinates of these tweets are not converted into locations, so it is hard for the user to tell where the user tweeted from without doing a search.

In this demo, we take a live stream of tweets and do location lookups based on the associated coordinates.  We then annotate **nearby** (rather then exact) locations in real time and display the result.

So you can see that someone tweeted from "Near Dolores Park / Mission District / San Francisco" instead of "37.7600, -122.4270".  This is a cool way to get "real location" context for real time information.

**How to try it out:**
  * Go to: http://geoapi.com/demos/twitter-nearby/
  * Select your location on the map (note for iPhone users below)
  * A stream of nearby tweets annotated by location will start showing (location annotations in red)

**How to use it on your iPhone:**
If you go to the demo using an iPhone (you can also use: http://bit.ly/46pls2), we will pull lat/lon from the phone and use that to show a nearby Tweet.

**Caveats:** Given that a single person built this demo in a few hours there are some caveats:
  * This demo refreshes the Twitter stream every 5 seconds (so as not to send too many requests to Twitter from our server).  Actual performance if integrated into a Twitter client would be substantially more awesome.
  * We snap tweets to the nearest point of interest (rather then a business) since we do business related demos above.  This means that for cities with sparser points of interest, the sets of nearby places that are annotated to tweets may be relatively small.

**Source Code:** http://code.google.com/p/geo-api/source/browse/#svn/trunk/demos/twitter-nearby

![http://blog-media.townme.com/twitterstream_final-small.png](http://blog-media.townme.com/twitterstream_final-small.png)

# Demo 3: Greasemonkey Script for Twitter #

_Shout out to Zboogs!_

**Part 1: Convert Place Names Into Canonical Locations**

We think it would be cool for there to be a "bit.ly for locations" or "hash tags for locations".  To this end we wrote a greasemonkey script that converts "::POI-name" into a linked URL for a point of interest near to where the user is.  We demo this as a Greasemonkey script for Twitter with the assumption that you, the user, are close to Ritual Roaster in San Francisco.  i.e. if you write "::ritual" or "::other-place-near-ritual" we will automatically convert "::ritual" to a link for "ritual roasters" and will take "::other-place-near-ritual" and resolve it to whatever likely business or point of interest that is.  (In this proof of concept demo we actually resolve to the closest POI or business that matches the string, so right now there is nothing to resolve ambiguities)

**Part 2: Convert Coordinates into Points of Interest**

The Greasemonkey script converts a lat/lons on Twitter to "real location".  So the coordinates "37.7600, -122.4270" get converted to the neighborhood the Tweet is from e.g. "Mission District / San Francisco".  The cool thing about this is if you are running greasemonkey you can actually see this location annotation occur in real time to your Twitter stream.  So this is a way for any Twitter user to see where all the people they are following are tweeting from.

**How to try it out:**
  * **You can only use Firefox for this demo** due to the dependency on [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/748)
  * Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/748)
  * Install the user script at http://geoapi.com/demos/twitter-greasemonkey/twitter-local.user.js.
  * Go to: http://twitter.com/geoapidemo (notice names of businesses are linked) on **Firefox**
  * Go to: http://search.twitter.com/search?q=+near%3A%22san+francisco%22+within%3A5mi (notice points of interest in **_red_**)

**Source Code:** http://code.google.com/p/geo-api/source/browse/#svn/trunk/demos/twitter-greasemonkey

![http://blog-media.townme.com/twitter-neighborhood-demo.png](http://blog-media.townme.com/twitter-neighborhood-demo.png)

![http://blog-media.townme.com/greasemonkey2_final-small.png](http://blog-media.townme.com/greasemonkey2_final-small.png)

# Demo 4: Media Layers: Tweets and Flickr Photos by Neighborhood #

This demo highlights the new media layers we have added to the GeoAPI. We make it easy for you to see the Tweets, Flickr photos, and other media associated with any polygon stored in our system (e.g. neighborhood, city, parks, etc.) .

In this demo you can restrict a tweet stream by neighborhood polygons. This allows you to view e.g. all the Tweets in the Mission District, or Flickr photos from SOMA, in San Francisco.

**Tweets:** Only a subset of Tweets currently have lat/lon coordinates. We map these coordinates to neighborhoods, and only show Tweets that fall within a given neighborhood boundary.  We automatically refresh the screen every 30 seconds.

**Flickr Photos:**
We look at Flickr photos published in the last few DAYS with lat/lon coordinates. We map these coordinates to neighborhoods, and only show photos that fall within a given neighborhood boundary.  Sometimes the photos are scarce since we only display photos from a handful of days.

**How to try it out:**
  * Twitter demo: http://geoapi.com/demos/twitter-neighborhoods/
  * Flickr demo: http://geoapi.com/demos/flickr-neighborhoods/

**Source Code:**
  * Twitter demo: http://code.google.com/p/geo-api/source/browse/#svn/trunk/demos/twitter-neighborhoods
  * Flickr demo: http://code.google.com/p/geo-api/source/browse/#svn/trunk/demos/flickr-neighborhoods

![http://blog-media.townme.com.s3.amazonaws.com/Flickrbyhood.png](http://blog-media.townme.com.s3.amazonaws.com/Flickrbyhood.png)


&lt;hr&gt;


![http://blog-media.townme.com.s3.amazonaws.com/Tweetsbyhood.png](http://blog-media.townme.com.s3.amazonaws.com/Tweetsbyhood.png)

# Demo 5: What's Near Me? #

We wrote a JavaScript app for mobile devices to let you see businesses nearby by category.  The app automatically grabs your location from iPhone and lets you chose nearest bars, restaurants, parking lots and more.

This highlights the value of the attribute function of the GeoAPI which allows developers to query the API based on category of business (e.g. thai restaurants) and other attributes.

**How to try it out:**
  * On to an iPhone
  * Go to: http://geoapi.com/demos/wnm/
  * Allow the page to get your current location
  * Select a business category
  * Either select an individual business or view all results on a map

![http://blog-media.townme.com.s3.amazonaws.com/WNM.jpg](http://blog-media.townme.com.s3.amazonaws.com/WNM.jpg)

**Source Code:** http://code.google.com/p/geo-api/source/browse/trunk#trunk/demos/wnm