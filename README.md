![npm](https://img.shields.io/npm/dt/react-native-mixpanel.svg?style=for-the-badge)

![npm](https://img.shields.io/npm/dm/react-native-mixpanel.svg?style=for-the-badge)


# Description
React Native wrapper for Mixpanel library, on top of the regular javascript sdk you can normally use, this provides you all the goodies of the native wrapper including notifications, analysis of the operating system, surveys etc..

If you'd like to support, you can donate some Ether to this address: 0x4cD5D72FFd950260e47F9e14F45811C5cCDD0283

# Installation
- Run `npm install react-native-mixpanel --save`
- Run `react-native link react-native-mixpanel`
  - (for RN 0.29.1+; otherwise use `rnpm link react-native-mixpanel`)

## Additional Step for iOS ##
- Install Mixpanel iOS SDK via either Cocoapods or manually [more info here](https://mixpanel.com/help/reference/ios)

## Additional info for Android (version >= 1.1.2) ##

From version 1.1.2 module uses Mixpanel SDK >= 5.6.0 that requires FCM

- Migration steps can be found [here](https://github.com/mixpanel/mixpanel-android/releases/tag/v5.5.0)
- Allow sub-classes to override push notifications payload and Support when more than one push provider is used [more info here](https://github.com/mixpanel/mixpanel-android/releases/tag/v5.5.1)


# Autolinking and RN >= 0.60

Autolinking should work out of the box.

Remember to do: pod install.

# Manual Installation

## Installation iOS ##
1. `npm install react-native-mixpanel --save`
2. Install Mixpanel iOS SDK via either Cocoapods or manually [more info here](https://mixpanel.com/help/reference/ios)
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-mixpanel` and add `RNMixpanel.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libRNMixpanel.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Click `RNMixpanel.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.
6. Run your project (`Cmd+R`)

## Installation Android ##

* In `android/setting.gradle`

```gradle
...
include ':react-native-mixpanel', ':app'
project(':react-native-mixpanel').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-mixpanel/android')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-mixpanel')
}
```

* register module (in MainActivity.java)

On newer versions of React Native register module (MainApplication.java):

```java
import com.kevinejohn.RNMixpanel.*;  // <--- import

public class MainActivity extends ReactActivity {
  ......

  /**
   * A list of packages used by the app. If the app uses additional views
   * or modules besides the default ones, add more packages here.
   */
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new RNMixpanel(), // <------ add here
        new MainReactPackage());
    }
}
```

# Usage

```js
// Require the module
var Mixpanel = require('react-native-mixpanel');

// Init Mixpanel SDK with your project token
//  @param apiToken - your project token
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN);

// You can also opt out tracking by default (GDPR)
//  @param apiToken - your project token
//  @param optOutTrackingByDefault - whether or not to be opted out from tracking by default (default value: false)
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN, false);

// You can also disable trackCrashes
//  @param apiToken - your project token
//  @param optOutTrackingByDefault - whether or not to be opted out from tracking by default (default value: false)
//  @param trackCrashes (iOS only!) - whether or not to track crashes in Mixpanel. may want to disable if you're seeing  issues with your crash reporting for either signals or exceptions (default value: true)
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN, false, true);

// You can also disable automaticPushTracking
//  @param apiToken - your project token
//  @param optOutTrackingByDefault - whether or not to be opted out from tracking by default (default value: false)
//  @param trackCrashes (iOS only!) - whether or not to track crashes in Mixpanel. may want to disable if you're seeing  issues with your crash reporting for either signals or exceptions (default value: true)
//  @param automaticPushTracking (iOS only!) - whether or not to automatically track pushes sent from Mixpanel (default value: true)
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN, false, true, true);

// You can also pass launchOptions
//  @param apiToken - your project token
//  @param optOutTrackingByDefault - whether or not to be opted out from tracking by default (default value: false)
//  @param trackCrashes (iOS only!) - whether or not to track crashes in Mixpanel. may want to disable if you're seeing  issues with your crash reporting for either signals or exceptions (default value: true)
//  @param automaticPushTracking (iOS only!) - whether or not to automatically track pushes sent from Mixpanel (default value: true)
//  @param launchOptions (iOS only!) - your application delegate's launchOptions (default value: null)
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN, false, true, true, null);

// Opt in tracking.
// Use this method to opt in an already opted out user from tracking. People updates and track calls will be sent to Mixpanel after using this method.
Mixpanel.optInTracking();

// Opt out tracking.

// This method is used to opt out tracking. This causes all events and people request no longer to be sent back to the Mixpanel server.
Mixpanel.optOutTracking();

// Send and event name with no properties
Mixpanel.track("Event name");

// Track event with properties
Mixpanel.trackWithProperties('Click Button', {button_type: 'yellow button', button_text: 'magic button'});

// Create Alias from unique id, i.e. create a new mixpanel profile: to call when a user signs up, with a unique id that is not used by another mixpanel profile as param
Mixpanel.createAlias(UNIQUE_ID)

// OR: 

// Create an alias, which Mixpanel will use to link two distinct_ids going forward (not retroactively). Multiple aliases can map to the same original ID, but not vice-versa.
// Aliases can also be chained - the following is a valid scenario:
Mixpanel.createAlias('new_id', 'existing_id');
...
Mixpanel.createAlias('newer_id', 'new_id');
// If the original ID is not passed in, we will use the current distinct_id - probably the auto-generated GUID.
// Notes: 
// The best practice is to call createAlias() when a unique ID is first created for a user (e.g., when a user first registers for
// an account and provides an email address). createAlias() should never be called more than once for a given user, except to chain
// a newer ID to a previously new ID, as described above.
// More info about createAlias: https://developer.mixpanel.com/docs/javascript-full-api-reference#section-mixpanel-alias

// Identify, i.e. associate to an existing mixpanel profile: to call when a user logs in and is already registered in Mixpanel with this unique id
Mixpanel.identify(UNIQUE_ID)

// Set People properties (warning: if no mixpanel profile has been assigned to the current user when this method is called, it will automatically create a new mixpanel profile and the user will no longer be anonymous in Mixpanel)
Mixpanel.set({"$email": "elvis@email.com"});

// Set People Properties Once (warning: if no mixpanel profile has been assigned to the current user when this method is called, it will automatically create a new mixpanel profile and the user will no longer be anonymous in Mixpanel)
Mixpanel.setOnce({"$email": "elvis@email.com", "Created": new Date().toISOString()});

// Add a new Group for this user.
// @param Group key
// @param A valid Mixpanel property type
Mixpanel.setGroup('company', 'mixpanel');

// Register the current user into one Group. The Group must be added before setting
// @param Group key
// @param a singular group ID
Mixpanel.setGroup('company', 'mixpanel');

// Timing Events
// Sets the start time for an action, for example uploading an image
Mixpanel.timeEvent("Image Upload");
// to be followed by a tracking event to define the end time
Mixpanel.track("Image Upload");

// Register super properties
Mixpanel.registerSuperProperties({"Account type": "Free", "User Type": "Vendor"});

// Register super properties Once
Mixpanel.registerSuperPropertiesOnce({"Gender": "Female"});

// track Revenue
Mixpanel.trackCharge(399);

// track with properties
Mixpanel.trackChargeWithProperties(399, {"product": "ACME Wearable tech"});

// increment property
Mixpanel.increment("Login Count", 1);

// Append array to a list property
Mixpanel.append("Lines", ["Simple", "Dashed"]);

// Merge array to a list property, excluding duplicate values
Mixpanel.union("Lines", ["Dashed", "Custom"]);

// Android
// Retrieves current Firebase Cloud Messaging token.
// Should only be called after identify(String) has been called.
Mixpanel.getPushRegistrationId();

// send push notifications token to Mixpanel
// Android
Mixpanel.setPushRegistrationId("GCM/FCM push token");

// Android
// tell Mixpanel which user record in People Analytics should receive the messages when they are sent from the Mixpanel app,
// make sure you call this right after you call `identify`
// Deprecated. 
// in 5.5.0. Google Cloud Messaging (GCM) is now deprecated by Google. To enable end-to-end Firebase Cloud Messaging (FCM) from Mixpanel you only need to add the following to your application manifest XML file:

 
//  <service
//        android:name="com.mixpanel.android.mpmetrics.MixpanelFCMMessagingService"
//        android:enabled="true"
//        android:exported="false">
//        <intent-filter>
//            <action android:name="com.google.firebase.MESSAGING_EVENT"/>
//        </intent-filter>
//  </service>
 
 

// Make sure you have a valid google-services.json file in your project and firebase messaging is included as a dependency. Example:

 
//  buildscript {
//       ...
//       dependencies {
//           classpath 'com.google.gms:google-services:4.1.0'
//           ...
//       }
//  }

//  dependencies {
//      implementation 'com.google.firebase:firebase-messaging:17.3.4'
//      implementation 'com.mixpanel.android:mixpanel-android:5.5.0'
//  }

//  apply plugin: 'com.google.gms.google-services'

// We recommend you update your Server Key on mixpanel.com from your Firebase console. Legacy server keys are still supported.
Mixpanel.initPushHandling(YOUR_12_DIGIT_GOOGLE_SENDER_ID);

// Allows to clear super properites
Mixpabel.clearSuperProperties();

// Android
// Unregister an android device for push notifications
// With token it will clear a single Firebase Cloud Messaging token from Mixpanel.
// Without token it will clear all current Firebase Cloud Messaging tokens from Mixpanel.
Mixpanel.clearPushRegistrationId(token?: string); 

// iOS
Mixpanel.addPushDeviceToken("APNS push token");

// iOS - unregister iOS device, pushDeviceToken = APNS push token
Mixpanel.removePushDeviceToken(pushDeviceToken: string); 

// iOS
// Unregister the given device to receive push notifications.
Mixpanel.removeAllPushDeviceTokens();

// Mixpanel reset method (warning: it will also generate a new unique id and call the identify method with it. Thus, the user will not be anonymous in Mixpanel.)
Mixpanel.reset();

// get the last distinct id set with identify or, if identify hasn't been
// called, the default mixpanel id for this device.
Mixpanel.getDistinctId(function(id){})
```

## Displaying in-app messages ##

By default, in-app messages are shown to users when the app starts and a message is available to display
This behaviour can be disabled by default, and explicitally triggered at a later time (e.g. after your loading sequence)

For iOS, in your app delegate, add the following line:

```
// In application:didFinishLaunchingWithOptions:
Mixpanel *mixpanel = [Mixpanel sharedInstanceWithToken:YOUR_MIXPANEL_TOKEN];
// Turn this off so the message doesn't pop up automatically.
mixpanel.showNotificationOnActive = NO;
```

For Android, add the following to your app mainifest in the `<application>` tag:

```
<meta-data android:name="com.mixpanel.android.MPConfig.AutoShowMixpanelUpdates" android:value="false" />
```

You can then call the following in your react native application:

```
Mixpanel.showInAppMessageIfAvailable();
```

More info: https://developer.mixpanel.com/docs/android-inapp-messages

## Configure mixpanel urls

Add server url in `.plist` files in iOS project.

```
<key>com.mixpanel.config.serverURL</key>
<string>https://api-eu.mixpanel.com</string>
```

Add endpoints to `manifest` in your Android project.

```
<application ...>
    <meta-data android:name="com.mixpanel.android.MPConfig.EventsEndpoint"
        android:value="https://api-eu.mixpanel.com/track" />
    <meta-data android:name="com.mixpanel.android.MPConfig.PeopleEndpoint"
        android:value="https://api-eu.mixpanel.com/engage" />
    <meta-data android:name="com.mixpanel.android.MPConfig.GroupsEndpoint"
        android:value="https://api-eu.mixpanel.com/groups" />
</application>
```

## Notes ##
For more info please have a look at the [official Mixpanel reference](https://mixpanel.com/help/reference/ios) for iOS
