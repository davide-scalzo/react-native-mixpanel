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

// to avoid having locks on every lookup, instances is kept in an immutable dictionary and reassigned when new instances are added
NSDictionary *instances = nil;

-(Mixpanel*) getInstance: (NSString *)name {
    Mixpanel* instance = [instances objectForKey:name]; // currently no error is thrown if an instance is missing
    return instance;
}

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE(RNMixpanel)

// sharedInstanceWithToken
RCT_EXPORT_METHOD(sharedInstanceWithToken:(NSString *)apiToken
                  optOutTrackingByDefault:(BOOL)optOutTrackingByDefault
                  trackCrashes:(BOOL)trackCrashes
                  automaticPushTracking:(BOOL)automaticPushTracking
                  launchOptions:(nullable NSDictionary *)launchOptions
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    @synchronized(self) {
        if (instances != nil && [instances objectForKey:apiToken] != nil) {
            resolve(nil);
            return;
        }

        Mixpanel *instance = [Mixpanel sharedInstanceWithToken:apiToken
                                                 launchOptions:launchOptions
                                                  trackCrashes:trackCrashes
                                         automaticPushTracking:automaticPushTracking
                                       optOutTrackingByDefault:optOutTrackingByDefault];

        // copy instances and add the new instance.  then reassign instances
        NSMutableDictionary *newInstances = [NSMutableDictionary dictionaryWithDictionary:instances];
        [newInstances setObject:instance forKey:apiToken];
        instances = [NSDictionary dictionaryWithDictionary:newInstances];
        [instance applicationDidBecomeActive:nil];
        resolve(nil);
    }
}

// setAppSessionProperties iOS
RCT_EXPORT_METHOD(setAppSessionPropertiesIOS:(NSDictionary *)properties) {
    if ([properties objectForKey:@"minimumSessionDuration"]) {
        NSNumber *minimumSessionDuration = properties[@"minimumSessionDuration"];
        long long int intValue = [minimumSessionDuration longLongValue];
        [Mixpanel sharedInstance].minimumSessionDuration = intValue;
    }

    if ([properties objectForKey:@"maximumSessionDuration"]) {
        NSNumber *maximumSessionDuration = properties[@"maximumSessionDuration"];
        long long int intValue = [maximumSessionDuration longLongValue];
        [Mixpanel sharedInstance].maximumSessionDuration = intValue;
    }
}

// get distinct id
RCT_EXPORT_METHOD(getDistinctId:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve([self getInstance:apiToken].distinctId);
}

// get superProp
RCT_EXPORT_METHOD(getSuperProperty: (NSString *)prop
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSDictionary *currSuperProps = [[self getInstance:apiToken] currentSuperProperties];
    resolve([currSuperProps objectForKey:prop]);
}

// track
RCT_EXPORT_METHOD(track:(NSString *)event
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] track:event];
    resolve(nil);
}

// disable ip address geolocalization
RCT_EXPORT_METHOD(disableIpAddressGeolocalization:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [self getInstance:apiToken].useIPAddressForGeoLocation = NO;
    resolve(nil);
}

// track with properties
RCT_EXPORT_METHOD(trackWithProperties:(NSString *)event
                  properties:(NSDictionary *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  ) {
    [[self getInstance:apiToken] track:event properties:properties];
    resolve(nil);
}

// flush
RCT_EXPORT_METHOD(flush:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] flush];
    resolve(nil);;
}

// create Alias
RCT_EXPORT_METHOD(createAlias:(NSString *)alias
                  oldDistinctID:(nullable NSString *)oldDistinctID
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSString *distinctId = oldDistinctID ? oldDistinctID : [self getInstance:apiToken].distinctId;
    [[self getInstance:apiToken] createAlias:alias forDistinctID:distinctId];
    resolve(nil);
}

// identify
RCT_EXPORT_METHOD(identify:(NSString *) uniqueId
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] identify:uniqueId];
    resolve(nil);
}

// add Group
RCT_EXPORT_METHOD(addGroup:(NSString *)groupKey
                  groupId:(NSString *)groupId
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] addGroup:groupKey groupID:groupId];
    resolve(nil);
}

// set Group
RCT_EXPORT_METHOD(setGroup:(NSString *)groupKey
                  groupId:(NSString *)groupId
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] setGroup:groupKey groupID:groupId];
    resolve(nil);
}

// Timing Events
RCT_EXPORT_METHOD(timeEvent:(NSString *)event
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] timeEvent:event];
    resolve(nil);
}

// Register super properties
RCT_EXPORT_METHOD(registerSuperProperties:(NSDictionary *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] registerSuperProperties:properties];
    resolve(nil);
}

// Register super properties Once
RCT_EXPORT_METHOD(registerSuperPropertiesOnce:(NSDictionary *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] registerSuperPropertiesOnce:properties];
    resolve(nil);
}

RCT_EXPORT_METHOD(clearSuperProperties:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] clearSuperProperties];
    resolve(nil);
}

// Init push notification
RCT_EXPORT_METHOD(initPushHandling:(NSString *) token
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [self addPushDeviceToken:token apiToken:apiToken resolve:resolve reject:reject];
}

// Set People Data
RCT_EXPORT_METHOD(set:(NSDictionary *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken].people set:properties];
    resolve(nil);
}

// Set People Data Once
RCT_EXPORT_METHOD(setOnce:(NSDictionary *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken].people setOnce: properties];
    resolve(nil);
}

// Remove Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(removePushDeviceToken:(NSString *)pushDeviceToken
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {

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

    [[self getInstance:apiToken].people removePushDeviceToken:deviceToken];
    resolve(nil);
}

// Remove Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(removeAllPushDeviceTokens:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken].people removeAllPushDeviceTokens];
    resolve(nil);
}

// track Revenue
RCT_EXPORT_METHOD(trackCharge:(nonnull NSNumber *)charge
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken].people trackCharge:charge];
    resolve(nil);
}

// track with properties
RCT_EXPORT_METHOD(trackChargeWithProperties:(nonnull NSNumber *)charge
                  properties:(NSDictionary *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken].people trackCharge:charge withProperties:properties];
    resolve(nil);
}

// increment
RCT_EXPORT_METHOD(increment:(NSString *)property
                  count:(nonnull NSNumber *)count
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken].people increment:property by:count];
    resolve(nil);
}

// Add Person's Push Token (iOS-only)
RCT_EXPORT_METHOD(addPushDeviceToken:(NSString *)pushDeviceToken
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
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
    [[self getInstance:apiToken].people addPushDeviceToken:deviceToken];
    resolve(nil);
}

// People union
RCT_EXPORT_METHOD(union:(NSString *)name
                  properties:(NSArray *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys: properties, name, nil];
    [[self getInstance:apiToken].people union:dict];
    resolve(nil);
}

// People append
RCT_EXPORT_METHOD(append:(NSString *)name
                  properties:(NSArray *)properties
                  apiToken:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys: properties, name, nil];
    [[self getInstance:apiToken].people append:dict];
    resolve(nil);
}

// reset
RCT_EXPORT_METHOD(reset:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] reset];
    NSString *uuid = [[NSUUID UUID] UUIDString];
    [[self getInstance:apiToken] identify:uuid];
    resolve(nil);
}

// showNotification
RCT_EXPORT_METHOD(showNotification:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] showNotification];
    resolve(nil);
}

// Opt in/out tracking
RCT_EXPORT_METHOD(optOutTracking:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] optOutTracking];
    resolve(nil);;
}

RCT_EXPORT_METHOD(optInTracking:(NSString *)apiToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[self getInstance:apiToken] optInTracking];
    resolve(nil);;
}

@end
