//  Copyright MixerLabs 2009. All rights reserved.

#import "GeoAPIDemoViewController.h"
#import <CoreLocation/CoreLocation.h>
#import "GAConnectionManager.h"
#import "GAParent.h"
#import "GAPlace.h"

@implementation GeoAPIDemoViewController

@synthesize textView = textView_;

typedef enum {
  kBusinessesNearCoords,
  kPlacesNearCoords,
  kParentsForCoords,
  kParentsForPlace,
  kListingForPlace,
  kWriteUserView,
  kReadUserView,
  kExecuteQuery
} RequestType;

// Get restaurants with rating greater than 4 that are not also coffee houses.
NSString *const kGoodNonCoffeehouseRestaurantsQuery =
  @"{"
  "   \"lat\": 37.75629,"
  "   \"lon\": -122.4213,"
  "   \"radius\": \"0.2km\","
  "   \"entity\": [{"
  "     \"guid\": null,"
  "     \"type\": \"business\","
  "     \"view.listing\": {"
  "       \"verticals\": \"restaurants\","
  "       \"verticals!=\": \"food-and-drink:coffee-houses\","
//  "       \"web-wide-rating>\": 4,"  XXX: uncomment this when server is ready.
  "       \"web-wide-rating\": null,"
  "       \"address\": [],"
  "       \"name\": null"
  "     }"
  "   }]"
  "}";

- (void)viewDidLoad {
  [super viewDidLoad];
  connectionManager_ = [[GAConnectionManager alloc] initWithAPIKey:@"demo" 
                                                          delegate:self];
  requestType_ = kBusinessesNearCoords;
  [self sendNextRequest];
}

- (void)sendNextRequest {
  CLLocationCoordinate2D coords;
  coords.latitude = 37.563475;
  coords.longitude = -122.323219;
  NSString *const guid = @"ritual-coffee-roasters-san-francisco-ca-94110";
  if (requestType_ == kBusinessesNearCoords) {
    [connectionManager_ requestBusinessesNearCoords:coords
                                       withinRadius:50
                                         maxResults:10];
  } else if (requestType_ == kPlacesNearCoords) {
    // Get names and phone numbers of nearby restaurants.  This example shows
    // how to construct an MQL query as a dictionary.
    NSMutableDictionary *entityDict =
    [[[NSMutableDictionary alloc] init] autorelease];
    [entityDict setValue:[NSNull null] forKey:@"guid"];
    [entityDict setValue:@"business" forKey:@"type"];
    [entityDict setValue:[NSNull null] forKey:@"distance-from-center"];
    NSMutableDictionary *listingDict =
    [[[NSMutableDictionary alloc] init] autorelease];
    [listingDict setValue:[NSNull null] forKey:@"name"];
    [listingDict setValue:[NSNull null] forKey:@"phone"];
    [listingDict setValue:@"restaurants" forKey:@"verticals"];
    [entityDict setValue:listingDict forKey:@"view.listing"];
    [connectionManager_ requestPlacesNearCoords:coords
                                   withinRadius:50
                                     maxResults:10
                                 withEntityDict:entityDict];  
  } else if (requestType_ == kParentsForCoords) {
    [connectionManager_ requestParentsForCoords:coords];
  } else if (requestType_ == kParentsForPlace) {
    [connectionManager_ requestParentsForPlace:guid];
  } else if (requestType_ == kListingForPlace) {
    [connectionManager_ requestListingForPlace:guid];
  } else if (requestType_ == kWriteUserView) {
    [connectionManager_ writeString:@"foo" toView:@"apidemo" forPlace:guid];
  } else if (requestType_ == kReadUserView) {
    [connectionManager_ requestStringFromView:@"apidemo" forPlace:guid];
  } else if (requestType_ == kExecuteQuery) {
    NSLog(@"Query: %@", kGoodNonCoffeehouseRestaurantsQuery);
    [connectionManager_ executeQuery:kGoodNonCoffeehouseRestaurantsQuery];
  }
}

- (void)receivedResponseString:(NSString *)responseString {
  NSLog(@"Received response: %@", responseString);
  NSMutableArray *outputRows = [[[NSMutableArray alloc] init] autorelease];
  [outputRows addObject:textView_.text];
  if (requestType_ == kBusinessesNearCoords) {
    [outputRows addObject:@"\n* Nearby businesses:"];
    for (GAPlace *place in [GAPlace placesWithJSON:responseString]) {
      [outputRows addObject:place.name];
    }
  } else if (requestType_ == kPlacesNearCoords) {
    [outputRows addObject:@"\n* Nearby restaurants:"];
    for (GAPlace *place in [GAPlace placesWithJSON:responseString]) {
      [outputRows addObject:place.name];
    }
  } else if (requestType_ == kParentsForCoords) {
    [outputRows addObject:@"\n* Parents for coords:"];
    for (GAParent *parent in [GAParent parentsWithJSON:responseString]) {
      [outputRows addObject:parent.name];
    }
  } else if (requestType_ == kParentsForPlace) {
    [outputRows addObject:@"\n* Parents for place:"];
    for (GAParent *parent in [GAParent parentsWithJSON:responseString]) {
      [outputRows addObject:parent.name];
    }
  } else if (requestType_ == kListingForPlace) {
    [outputRows addObject:@"\n* Address from listing:"];
    GAPlace *place = [GAPlace placeWithListingJSON:responseString];
    [outputRows addObject:place.address];
  } else if (requestType_ == kWriteUserView) {
    [outputRows addObject:@"\n* Writing to user view:"];
    [outputRows addObject:responseString];
  } else if (requestType_ == kReadUserView) {
    [outputRows addObject:@"\n* Reading from user view:"];
    [outputRows addObject:responseString];
  } else if (requestType_ == kExecuteQuery) {
    [outputRows addObject:@"\n* Good non-coffeehouse restaurants:"];
    for (GAPlace *place in [GAPlace placesWithJSON:responseString]) {
      NSNumber *rating = [place.listing objectForKey:@"web-wide-rating"];
      [outputRows addObject:[NSString stringWithFormat:@"%@ (rating: %@)", 
                                                       place.name, rating]];
    }
  }
  textView_.text = [outputRows componentsJoinedByString:@"\n"];
  requestType_++;
  [self sendNextRequest];
}

- (void)requestFailed:(NSError *)error {
  textView_.text = [NSString stringWithFormat:@"%@\nRequest %d failed: %@.\n",
                    textView_.text, requestType_, [error localizedDescription]];
  requestType_++;
  [self sendNextRequest];  
}

- (void)dealloc {
  [connectionManager_ release];
  [textView_ release];
  [super dealloc];
}

@end
