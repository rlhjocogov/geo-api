//  Copyright MixerLabs 2009. All rights reserved.
//
//  This class simply requests data from the Geo API and displays the results.

#import <UIKit/UIKit.h>
#import "GAConnectionDelegate.h"

@class GAConnectionManager;

@interface GeoAPIDemoViewController : UIViewController <GAConnectionDelegate> {
@private
  GAConnectionManager *connectionManager_;
  int requestType_;
  UITextView *textView_;
}

- (void)receivedResponseString:(NSString *)responseString;
- (void)requestFailed:(NSError *)error;

- (void)sendNextRequest;

@property (nonatomic, retain) IBOutlet UITextView *textView;

@end

