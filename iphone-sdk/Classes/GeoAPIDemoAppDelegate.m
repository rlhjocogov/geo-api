//  Copyright MixerLabs 2009. All rights reserved.

#import "GeoAPIDemoAppDelegate.h"
#import "GeoAPIDemoViewController.h"

@implementation GeoAPIDemoAppDelegate

@synthesize window;
@synthesize viewController;


- (void)applicationDidFinishLaunching:(UIApplication *)application {    
    
    // Override point for customization after app launch    
    [window addSubview:viewController.view];
    [window makeKeyAndVisible];
}


- (void)dealloc {
    [viewController release];
    [window release];
    [super dealloc];
}


@end
