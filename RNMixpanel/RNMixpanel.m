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

Mixpanel *defaultInstance = nil;

NSMutableDictionary *otherInstances = nil;

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE(RNMixpanel)

// sharedInstanceWithToken
RCT_EXPORT_METHOD(sharedInstanceWithToken:(NSString *)apiToken name:(NSString *)name) {
    Mixpanel *instance = [Mixpanel sharedInstanceWithToken:apiToken];
    if (name == nil) {
        defaultInstance = instance;
    } else {
        if (otherInstances == nil) {
            otherInstances = [NSMutableDictionary dictionaryWithCapacity:1]; // 1 is typical, any more and it can reallocate
        }
        [otherInstances setObject:instance forKey:name];
    }
    // React Native runs too late to listen for applicationDidBecomeActive,
    // so we expose the private method and call it explicitly here,
    // to ensure that important things like initializing the flush timer and
    // checking for pending surveys and notifications.
    [instance applicationDidBecomeActive:nil];
}


// get distinct id
RCT_EXPORT_METHOD(getDistinctId:(NSString *)instanceName callback:(RCTResponseSenderBlock)callback) {
    callback(@[[self getInstance:instanceName].distinctId ?: @""]);
}

// get superProp
RCT_EXPORT_METHOD(getSuperProperty: (NSString *)prop instanceName:(NSString *)instanceName callback:(RCTResponseSenderBlock)callback) {
    NSDictionary *currSuperProps = [[self getInstance:instanceName] currentSuperProperties];

    if ([currSuperProps objectForKey:prop]) {
        NSString *superProp = currSuperProps[prop];
        callback(@[superProp]);
    } else {
        callback(@[[NSNull null]]);
    }
}

// track
RCT_EXPORT_METHOD(track:(NSString *)event instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] track:event];
}

// track with properties
RCT_EXPORT_METHOD(trackWithProperties:(NSString *)event properties:(NSDictionary *)properties instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] track:event properties:properties];
}

// flush
RCT_EXPORT_METHOD(flush:(NSString *)instanceName) {
    [[self getInstance:instanceName] flush];
}

// create Alias
RCT_EXPORT_METHOD(createAlias:(NSString *)old_id instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] createAlias:old_id forDistinctID:defaultInstance.distinctId];
}

// identify
RCT_EXPORT_METHOD(identify:(NSString *) uniqueId instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] identify:uniqueId];
}

// Timing Events
RCT_EXPORT_METHOD(timeEvent:(NSString *)event instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] timeEvent:event];
}

// Register super properties
RCT_EXPORT_METHOD(registerSuperProperties:(NSDictionary *)properties instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] registerSuperProperties:properties];
}

// Register super properties Once
RCT_EXPORT_METHOD(registerSuperPropertiesOnce:(NSDictionary *)properties instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName] registerSuperPropertiesOnce:properties];
}

// Init push notification
RCT_EXPORT_METHOD(initPushHandling:(NSString *) token instanceName:(NSString *)instanceName) {
     [self addPushDeviceToken:token instanceName:instanceName];
}

// Set People Data
RCT_EXPORT_METHOD(set:(NSDictionary *)properties instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName].people set:properties];
}

// Set People Data Once
RCT_EXPORT_METHOD(setOnce:(NSDictionary *)properties instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName].people setOnce: properties];
}

// Remove Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(removePushDeviceToken:(NSData *)deviceToken instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName].people removePushDeviceToken:deviceToken];
}

// Remove Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(removeAllPushDeviceTokens:(NSString *)instanceName) {
    [[self getInstance:instanceName].people removeAllPushDeviceTokens];
}

// track Revenue
RCT_EXPORT_METHOD(trackCharge:(nonnull NSNumber *)charge instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName].people trackCharge:charge];
}

// track with properties
RCT_EXPORT_METHOD(trackChargeWithProperties:(nonnull NSNumber *)charge properties:(NSDictionary *)properties instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName].people trackCharge:charge withProperties:properties];
}

// increment
RCT_EXPORT_METHOD(increment:(NSString *)property count:(nonnull NSNumber *)count instanceName:(NSString *)instanceName) {
    [[self getInstance:instanceName].people increment:property by:count];
}

// Add Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(addPushDeviceToken:(NSString *)pushDeviceToken instanceName:(NSString *)instanceName) {
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
    [[self getInstance:instanceName].people addPushDeviceToken:deviceToken];
}

// reset
RCT_EXPORT_METHOD(reset:(NSString *)instanceName) {
    [[self getInstance:instanceName] reset];
    NSString *uuid = [[NSUUID UUID] UUIDString];
    [[self getInstance:instanceName] identify:uuid];
}

-(Mixpanel*) getInstance: (NSString *)name {
    if (name == nil) return defaultInstance;
    return [otherInstances objectForKey:name]; // currently pay no regard to missing instances
}

@end
