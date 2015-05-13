# Welcome to the GeoAPI.com Developer Site #

The Mixer Labs / TownMe GeoAPI was designed to make it easy for application developers to create applications that rely on data about places.

**Sign up for your key [here](http://spreadsheets.google.com/viewform?formkey=dGJscE5kWmc1ZjVDUzFQUW8yMmdNa0E6MA)**

Examples of things that are possible using the GeoAPI are:

_**Read Components**_
  * **Reverse Geocoding**: Translating lat/lons coordinates into human-relevant entities (businesses, neighborhoods, towns, etc...)
  * **Point of Interest Finder**: From any lat/lon, find nearby points of interest and filter them by type.
  * **Standardized Business Information**: Information about businesses, including address, phone, hours of operation and keywords.
  * **Canonical URLs**: Each entity has a unique canonical url (and a shortened one for inclusion in tweets and such).
  * **Media Layers**: We let you do complex geoqueries against Twitter, Flickr and other sources of content.  E.g. "Show me all the Flickr photos with lat/long coordinates from within the polygon that represents Dolores Park in San Francisco, CA".

_**Write Components**_
  * **Write Information About Entities**: Write and overlay information from your app onto your apps view of the database of points of interest and businesses - create a unique virtual overlay of the world that your app users can see.

_**SDKs**_
  * **iPhone**:  We have an SDK for the iPhone.

_Note that this is a work in progress, so make sure to check in regularly for updates and new features. And please help us make it better by notifying us of issues, requesting features, contributing demo code - and, obviously building great applications! :)_

## Table of Contents ##
  * [Getting Started](GettingStarted.md)
  * [Some Sample Queries](SampleQueries.md)
  * [Key Concepts: Entities and Views](KeyConcepts.md)
  * API Reference
    * [search methods](MethodSearch.md)
      * [simple search](MethodSimpleSearch.md)
      * [MQL search](MethodMQLSearch.md)
    * [parents](MethodParents.md)
    * [Views](KeyConcepts#Views.md)
      * [listing](ViewListing.md)
      * [userview - i.e. writable layer](ViewUser.md)
      * [twitter](ViewTwitter.md)
      * [flickr](ViewFlickr.md)
    * [Some Data Sources](DataSources.md)
  * [Demos](Demos.md)
  * [iPhone SDK](iPhoneSDK.md)
  * [Terms of Use](TermsOfUse.md)
  * [Sign Up For an API Key](http://spreadsheets.google.com/viewform?formkey=dGJscE5kWmc1ZjVDUzFQUW8yMmdNa0E6MA)


# Issues & Feature Requests #
  * **Issues/Bugs**: If you have a bug report or feature request, please post it on the [Issues Page](http://code.google.com/p/geo-api/issues/list).
  * **Technical Questions**: For general technical questions, we encourage the use of the [GeoAPI.com Google Group](http://groups.google.com/group/geoapi).
  * **Contact Us**: "support _at_ geoapi _dot_ com"