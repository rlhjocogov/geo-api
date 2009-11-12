//  Copyright MixerLabs 2009. All rights reserved.
//
// This app demonstrates how to use the Geo API library in your iPhone
// application.  The basic procedure is to implement GAConnectionDelegate in
// a view controller and parse the JSON responses using GAParent and GAPlace.

#import <UIKit/UIKit.h>

@class GeoAPIDemoViewController;

@interface GeoAPIDemoAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
    GeoAPIDemoViewController *viewController;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet GeoAPIDemoViewController *viewController;

@end
