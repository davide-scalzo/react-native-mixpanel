[![BCH compliance](https://bettercodehub.com/edge/badge/davodesign84/react-native-mixpanel?branch=master)](https://bettercodehub.com/)


# Description
React Native wrapper for Mixpanel library, on top of the regular javascript sdk you can normally use, this provides you all the goodies of the native wrapper including notifications, analysis of the operating system, surveys etc..

If you'd like to support, you can donate some Ether to this address: 0x4cD5D72FFd950260e47F9e14F45811C5cCDD0283

# Installation
- Run `npm install react-native-mixpanel --save`
- Run `react-native link react-native-mixpanel`
  - (for RN 0.29.1+; otherwise use `rnpm link react-native-mixpanel`)

## Additional Step for iOS ##
- Install Mixpanel iOS SDK via either Cocoapods or manually [more info here](https://mixpanel.com/help/reference/ios)


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
include ':RNMixpanel', ':app'
project(':RNMixpanel').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-mixpanel/android')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':RNMixpanel')
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
//Require the module
var Mixpanel = require('react-native-mixpanel');

//Init Mixpanel SDK with your project token
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN);

//Send and event name with no properties
Mixpanel.track("Event name");

//Track event with properties
Mixpanel.trackWithProperties('Click Button', {button_type: 'yellow button', button_text: 'magic button'});

//Create Alias from unique id
Mixpanel.createAlias(UNIQUE_ID)

//Identify
Mixpanel.identify(UNIQUE_ID)

//Set People properties
Mixpanel.set({"$email": "elvis@email.com"});

//Set People Properties Once
Mixpanel.setOnce({"$email": "elvis@email.com", "Created": new Date().toISOString()});

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

// send push notifications token to Mixpanel
// Android
Mixpanel.setPushRegistrationId("GCM/FCM push token");

//tell Mixpanel which user record in People Analytics should receive the messages when they are sent from the Mixpanel app,
//make sure you call this right after you call `identify`
Mixpanel.initPushHandling(YOUR_12_DIGIT_GOOGLE_SENDER_ID);

//unregister a device for push notifications
Mixpanel.clearPushRegistrationId();

// iOS
Mixpanel.addPushDeviceToken("APNS push token")

// Mixpanel reset method
Mixpanel.reset();

// get the last distinct id set with identify or, if identify hasn't been
// called, the default mixpanel id for this device.
Mixpanel.getDistinctId(function(id){})
```

## Notes ##
For more info please have a look at the [official Mixpanel reference](https://mixpanel.com/help/reference/ios) for iOS
