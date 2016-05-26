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

// Timing Events
RCT_EXPORT_METHOD(timeEvent:(NSString *)event) {
    [mixpanel timeEvent:event];
    [mixpanel flush];
}

// get distinct id
RCT_EXPORT_METHOD(getDistinctId:(RCTResponseSenderBlock)callback) {
    callback(@[mixpanel.distinctId]);
}

// Register super properties
RCT_EXPORT_METHOD(registerSuperProperties:(NSDictionary *)properties) {
    [mixpanel registerSuperProperties:properties];
    [mixpanel flush];
}

// Register super properties Once
RCT_EXPORT_METHOD(registerSuperPropertiesOnce:(NSDictionary *)properties) {
    [mixpanel registerSuperPropertiesOnce:properties];
    [mixpanel flush];
}

// Set People Data
RCT_EXPORT_METHOD(set:(NSDictionary *)properties) {
    [mixpanel.people set:properties];
}

// track Revenue
RCT_EXPORT_METHOD(trackCharge:(nonnull NSNumber *)charge) {
    [mixpanel.people trackCharge:charge];
    [mixpanel flush];
}

// track with properties
RCT_EXPORT_METHOD(trackChargeWithProperties:(nonnull NSNumber *)charge properties:(NSDictionary *)properties) {
    [mixpanel.people trackCharge:charge withProperties:properties];
    [mixpanel flush];
}

// increment
RCT_EXPORT_METHOD(increment:(NSString *)property count:(nonnull NSNumber *)count) {
  [mixpanel.people increment:property by:count];
  [mixpanel flush];
}

// reset
RCT_EXPORT_METHOD(reset) {
    [mixpanel reset];
    [mixpanel flush];
}

@end
