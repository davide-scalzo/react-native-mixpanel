//
//  RNMixpanel.m
//  Dramsclub
//
//  Created by Davide Scalzo on 08/11/2015.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RNMixpanel.h"
#import "Mixpanel.h"

@implementation RNMixpanel

Mixpanel *mixpanel = nil;

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE(RNMixpanel)

// sharedInstanceWithToken
RCT_EXPORT_METHOD(sharedInstanceWithToken:(NSString *)apiToken) {

    
    [Mixpanel sharedInstanceWithToken:apiToken];
    mixpanel = [Mixpanel sharedInstance];
    
}


// track
RCT_EXPORT_METHOD(track:(NSString *)event) {
    [mixpanel track:event];
    [mixpanel flush];
    
}

// track with properties
RCT_EXPORT_METHOD(trackWithProperties:(NSString *)event properties:(NSDictionary *)properties) {
    [mixpanel track:event properties:properties];
    [mixpanel flush];
    
}

// create Alias
RCT_EXPORT_METHOD(createAlias:(NSString *)old_id) {
    [mixpanel createAlias:old_id forDistinctID:mixpanel.distinctId];
}

// identify
RCT_EXPORT_METHOD(identify:(NSString *) uniqueId) {
    [mixpanel identify:uniqueId];
}

// Set People Data
RCT_EXPORT_METHOD(set:(NSString *)key value:(NSString *)value) {
    [mixpanel.people set:@{key: value}];
}

@end
