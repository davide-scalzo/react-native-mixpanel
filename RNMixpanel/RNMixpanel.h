//
//  RNMixpanel.h
//  Dramsclub
//
//  Created by Davide Scalzo on 08/11/2015.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RNMixpanel : NSObject<RCTBridgeModule>

+ (RNMixpanel *)sharedInstanceWithToken:(NSString *)apiToken launchOptions:(NSDictionary *)launchOptions;
+ (RNMixpanel *)sharedInstanceWithToken:(NSString *)apiToken launchOptions:(nullable NSDictionary *)launchOptions trackCrashes:(BOOL)trackCrashes automaticPushTracking:(BOOL)automaticPushTracking optOutTrackingByDefault:(BOOL)optOutTrackingByDefault;
@end
