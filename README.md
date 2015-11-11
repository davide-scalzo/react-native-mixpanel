# react-native-mixpanel
A React Native wrapper for Mixpanel tracking

Super simple wrapper for Mixpanel tracking

##Installation##
1. `npm install react-native-mixpanel --save`
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-mixpanel` and add `RNMixpanel.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libRNMixpanel.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Click `RNMixpanel.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.
5. Run your project (`Cmd+R`)

##Usage##
```
//Require the module
var Mixpanel = require('react-native-mixpanel');

//Init Mixpanel SDK with your project token
Mixpanel.sharedInstanceWithToken(YOUR_PROJECT_TOKEN);

//Send and event name with no properties
Mixpanel.track('Event name');

//Track event with properties
Mixpanel.trackWithProperties('Click Button', {button_type: 'yellow button', button_text: 'magic button'});

//Create Alias from unique id
Mixpanel.createAlias(UNIQUE_ID)

//Identify
Mixpanel.identify(UNIQUE_ID)

//Set People properties
Mixpanel.set('$email', "elvis@email.com");
```

##Notes##
For more info please have a look at the [official Mixpanel reference](https://mixpanel.com/help/reference/ios) for iOS

