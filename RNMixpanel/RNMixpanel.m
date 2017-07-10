//
//  RNMixpanel.m
//  Dramsclub
//
//  Created by Davide Scalzo on 08/11/2015.
//  Forked by Kevin Hylant on 5/3/2016.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RNMixpanel.h"
#import "Mixpanel.h"

@interface Mixpanel (ReactNative)
- (void)applicationDidBecomeActive:(NSNotification *)notification;
@end

@implementation RNMixpanel

Mixpanel *mixpanel = nil;

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE(RNMixpanel)

// sharedInstanceWithToken
RCT_EXPORT_METHOD(sharedInstanceWithToken:(NSString *)apiToken) {
    [Mixpanel sharedInstanceWithToken:apiToken];
    mixpanel = [Mixpanel sharedInstance];
    // React Native runs too late to listen for applicationDidBecomeActive,
    // so we expose the private method and call it explicitly here,
    // to ensure that important things like initializing the flush timer and
    // checking for pending surveys and notifications.
    [mixpanel applicationDidBecomeActive:nil];
}

// get distinct id
RCT_EXPORT_METHOD(getDistinctId:(RCTResponseSenderBlock)callback) {
    callback(@[mixpanel.distinctId ?: @""]);
}

// get superProp
RCT_EXPORT_METHOD(getSuperProperty: (NSString *)prop callback:(RCTResponseSenderBlock)callback) {
    NSDictionary *currSuperProps = [mixpanel currentSuperProperties];

    if ([currSuperProps objectForKey:prop]) {
        NSString *superProp = currSuperProps[prop];
        callback(@[superProp]);
    } else {
        callback(@[[NSNull null]]);
    }
}

// track
RCT_EXPORT_METHOD(track:(NSString *)event) {
    [mixpanel track:event];
}

// track with properties
RCT_EXPORT_METHOD(trackWithProperties:(NSString *)event properties:(NSDictionary *)properties) {
    [mixpanel track:event properties:properties];
}

// flush
RCT_EXPORT_METHOD(flush) {
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
}

// Register super properties
RCT_EXPORT_METHOD(registerSuperProperties:(NSDictionary *)properties) {
    [mixpanel registerSuperProperties:properties];
}

// Register super properties Once
RCT_EXPORT_METHOD(registerSuperPropertiesOnce:(NSDictionary *)properties) {
    [mixpanel registerSuperPropertiesOnce:properties];
}

// Init push notification
RCT_EXPORT_METHOD(initPushHandling:(NSString *) token) {
     [mixpanel.people addPushDeviceToken:token];
}

// Set People Data
RCT_EXPORT_METHOD(set:(NSDictionary *)properties) {
    [mixpanel.people set:properties];
}

// Set People Data Once
RCT_EXPORT_METHOD(setOnce:(NSDictionary *)properties) {
    [mixpanel.people setOnce: properties];
}

// Remove Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(removePushDeviceToken:(NSData *)deviceToken) {
    [mixpanel.people removePushDeviceToken:deviceToken];
}

// Remove Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(removeAllPushDeviceTokens) {
    [mixpanel.people removeAllPushDeviceTokens];
}

// track Revenue
RCT_EXPORT_METHOD(trackCharge:(nonnull NSNumber *)charge) {
    [mixpanel.people trackCharge:charge];
}

// track with properties
RCT_EXPORT_METHOD(trackChargeWithProperties:(nonnull NSNumber *)charge properties:(NSDictionary *)properties) {
    [mixpanel.people trackCharge:charge withProperties:properties];
}

// increment
RCT_EXPORT_METHOD(increment:(NSString *)property count:(nonnull NSNumber *)count) {
    [mixpanel.people increment:property by:count];
}

// Add Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(addPushDeviceToken:(NSString *)pushDeviceToken) {
    NSMutableData *deviceToken = [[NSMutableData alloc] init];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0','\0','\0'};
    int i;
    for (i=0; i < [pushDeviceToken length]/2; i++) {
        byte_chars[0] = [pushDeviceToken characterAtIndex:i*2];
        byte_chars[1] = [pushDeviceToken characterAtIndex:i*2+1];
        whole_byte = strtol(byte_chars, NULL, 16);
        [deviceToken appendBytes:&whole_byte length:1];
    }
    [mixpanel.people addPushDeviceToken:deviceToken];
}

// reset
RCT_EXPORT_METHOD(reset) {
    [mixpanel reset];
    NSString *uuid = [[NSUUID UUID] UUIDString];
    [mixpanel identify:uuid];
}

@end
