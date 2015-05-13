To get started using the Mixer Labs GeoAPI, you should make sure to understand the core concepts and read the documentation (I guess you're in the right place!). To play around with the API, you can either use your web browser or a command line http tool such as curl. You can also download our simple [Python API client](http://code.google.com/p/geo-api/source/browse/#svn/trunk) (feel free to contribute a client in your favorite language!).

# API Keys #

To use the GeoAPI, you will need to get an [API Key](http://spreadsheets.google.com/viewform?formkey=dGJscE5kWmc1ZjVDUzFQUW8yMmdNa0E6MA). There is a testing/demo key that you can use ("demo"), but **please** remember to not use it in production. Everyone is tinkering with it, so you are very likely to get your app blocked due to rate limits.

In our beta phase, we will be rolling out API keys progressively. If you would like to get an API Key, please fill out the form linked above and we'll get back to you as soon as possible.


# Rate Limiting #

If your app is taking off like a rocketship, please let us know and we are happy to adjust the query per day thresholds. By default, each API Key is limited to 20,000 queries per day. If you come within striking distance of that, email us at "api _at_ geoapi.com" and we can up your QPDs.


# Terms of Use #

We tried to keep the [Terms of Use](TermsOfUse.md) clear and reasonable. Please read them carefully. If you rely on us as an important piece of infrastructure, please make sure to understand what is OK and what isn't. If you're not clear on the terms, please email us at "api _at_ geoapi.com".