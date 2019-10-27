// @flow
'use strict'
import { NativeModules, Platform } from 'react-native'
const { RNMixpanel } = NativeModules

/*
An error that is thrown or promise.rejected when a function is invoked before initialize() has completed.
*/
const NO_INSTANCE_ERROR = 'No mixpanel instance created yet.  You must call sharedInstanceWithToken(token) or MixPanelInstance.initialize(token) before anything else and should wait for its promise to fulfill before others calls to avoid any internal native issue.'
const uninitializedError: (string) => Error = (method: string) => new Error(`Mixpanel instance was not initialized yet.  Please run initialize() and wait for its promise to resolve before calling ${method}(...)`)
let defaultInstance:?MixpanelInstance = null

/*
A Mixpanel target.  Normally there is only one of these.  If you want to log to multiple Mixpanel projects, you can create a new instance of this class with a unique name.  Then call initiaze and you can start logging.
Most of the functions, like track and alias return a Promise.  The functions will be called and normally you shouldn't have to care about awaiting them.
However since React Native makes no guarantees about whether native methods are called in order, if you want to be 100% sure everything will work, like calling identify() before track(), you should await those promises to ensure everything is called properly.
*/
export class MixpanelInstance {
  apiToken: ?string
  optOutTrackingDefault: boolean
  trackCrashes: boolean
  automaticPushTracking: boolean
  launchOptions: object
  initialized: boolean

  constructor(apiToken: ?string, optOutTrackingDefault: ?boolean = false, trackCrashes: ?boolean = true, automaticPushTracking: ?boolean = true, launchOptions: ?Object = null) {
    this.apiToken = apiToken
    this.optOutTrackingDefault = optOutTrackingDefault
    this.trackCrashes = trackCrashes
    this.automaticPushTracking = automaticPushTracking
    this.launchOptions = launchOptions
    this.initialized = false
  }

  /*
  Initializes the instance in native land.  Returns a promise that resolves when the instance has been created and is ready for use.
  */
  initialize(): Promise<void> {
    if (Platform.OS === 'ios'){
      return RNMixpanel.sharedInstanceWithToken(this.apiToken, this.optOutTrackingDefault, this.trackCrashes, this.automaticPushTracking, this.launchOptions)
      .then(() => {
        this.initialized = true
      })
    } else {
      return RNMixpanel.sharedInstanceWithToken(this.apiToken, this.optOutTrackingDefault)
      .then(() => {
        this.initialized = true
      })
    }
  }

  /*
  Gets the unique identifier for the current user.  Returns a promise that resolves with the value.
  */
  getDistinctId(): Promise<string> {
    if (!this.initialized) {
      return Promise.reject(new Error(uninitializedError('getDistinctId')))
    }
    return RNMixpanel.getDistinctId(this.apiToken)
  }

  /*
  Retrieves current Firebase Cloud Messaging token.
  */
 getPushRegistrationId(): Promise<string> {
    if (!this.initialized) {
      return Promise.reject(new Error(uninitializedError('getPushRegistrationId')))
    }
    if (!RNMixpanel.getPushRegistrationId) throw new Error('No native implementation for getPushRegistrationId.  This is Android only.')
    return RNMixpanel.getPushRegistrationId(this.apiToken)
  }

  /*
  Gets the given super property.  Returns a promise that resolves to the value.
  */
  getSuperProperty(propertyName: string): Promise<mixed> {
    if (!this.initialized) {
      return Promise.reject(new Error(uninitializedError('getSuperProperty')))
    }
    return RNMixpanel.getSuperProperty(propertyName, this.apiToken)
  }

  /*
  Logs the event.
  */
  track(event: string, properties?: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('track'))
    if (properties) {
      return RNMixpanel.trackWithProperties(event, properties, this.apiToken)
    } else {
      return RNMixpanel.track(event, this.apiToken)
    }
  }

  flush(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('flush'))
    return RNMixpanel.flush(this.apiToken)
  }

  disableIpAddressGeolocalization(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('disableIpAddressGeolocalization'))
    return RNMixpanel.disableIpAddressGeolocalization(this.apiToken)
  }

  alias(alias: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('createAlias'))

    return RNMixpanel.createAlias(alias, this.apiToken)
  }

  identify(userId: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('identify'))

    return RNMixpanel.identify(userId, this.apiToken)
  }

  timeEvent(event: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('timeEvent'))

    return RNMixpanel.timeEvent(event, this.apiToken)
  }

  registerSuperProperties(properties: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('registerSuperProperties'))

    return RNMixpanel.registerSuperProperties(properties, this.apiToken)
  }

  registerSuperPropertiesOnce(properties: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('registerSuperPropertiesOnce'))

    return RNMixpanel.registerSuperPropertiesOnce(properties, this.apiToken)
  }

  clearSuperProperties(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('clearSuperProperties'))
    return RNMixpanel.clearSuperProperties(this.apiToken)
  }

  initPushHandling(token: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('initPushHandling'))

    return RNMixpanel.initPushHandling(token, this.apiToken)
  }

  set(properties: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('set'))

    return RNMixpanel.set(properties, this.apiToken)
  }

  setOnce(properties: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('setOnce'))

    return RNMixpanel.setOnce(properties, this.apiToken)
  }

  trackCharge(charge: number): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('trackCharge'))

    return RNMixpanel.trackCharge(charge, this.apiToken)
  }

  trackChargeWithProperties(charge: number, properties: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('trackChargeWithProperties'))

    return RNMixpanel.trackChargeWithProperties(charge, properties, this.apiToken)
  }

  increment(property: string, by: number): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('increment'))

    return RNMixpanel.increment(property, by, this.apiToken)
  }

  union(name: string, properties: any[]): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('union'))

    return RNMixpanel.union(name, properties, this.apiToken)
  }

  append(name: string, properties: any[]): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('append'))

    return RNMixpanel.append(name, properties, this.apiToken)
  }

  removePushDeviceToken(pushDeviceToken: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('removePushDeviceToken'))

    return RNMixpanel.removePushDeviceToken(pushDeviceToken, this.apiToken)
  }

  removeAllPushDeviceTokens(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('removeAllPushDeviceTokens'))

    return RNMixpanel.removeAllPushDeviceTokens(this.apiToken)
  }

  addPushDeviceToken(token: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('addPushDeviceToken'))

    return RNMixpanel.addPushDeviceToken(token, this.apiToken)
  }

  // android only
  setPushRegistrationId(token: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('setPushRegistrationId'))

    if (!RNMixpanel.setPushRegistrationId) throw new Error('No native implementation for setPushRegistrationId.  This is Android only.')
    return RNMixpanel.setPushRegistrationId(token, this.apiToken)
  }

  // android only
  clearPushRegistrationId(token?: string): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('clearPushRegistrationId'))

    if (!RNMixpanel.clearPushRegistrationId) throw new Error('No native implementation for setPusclearPushRegistrationIdhRegistrationId.  This is Android only.')
    return RNMixpanel.clearPushRegistrationId(token, this.apiToken)
  }

  reset(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('reset'))

    return RNMixpanel.reset(this.apiToken)
  }

  showInAppMessageIfAvailable(): Promise<void> {
    if (!this.initialized) throw uninitializedError('showNotificationIfAvailable')

    if (Platform.OS === "android") {
        return RNMixpanel.showNotificationIfAvailable(this.apiToken)
    } else {
        return RNMixpanel.showNotification(this.apiToken)
    }
  }

  optInTracking(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('optInTracking'))
    return RNMixpanel.optInTracking(this.apiToken)
  }

  optOutTracking(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('optOutTracking'))
    return RNMixpanel.optOutTracking(this.apiToken)
  }
}

/*
This is the original API and can still be used.  However some may find it useful to use MixpanelInstance instead, like
```
const mixpanel = new MixpanelInstance(TOKEN)
await mixpanel.initialize()
mixpanel.track('my event')
```
*/
export default {

  sharedInstanceWithToken(apiToken: string, optOutTrackingDefault: ?boolean = false, trackCrashes: ?boolean = true, automaticPushTracking: ?boolean = true, launchOptions: ?Object = null): Promise<void> {
    const instance = new MixpanelInstance(apiToken, optOutTrackingDefault)
    if (!defaultInstance) defaultInstance = instance
    return instance.initialize()
  },

  /*
  Gets the unique instance for a user.  If you want to use promises, use the MixpanelInstace class API instead.
  */
  getDistinctId(callback: (id: ?string) => void) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.getDistinctId()
      .then((id: string) => {
        callback(id)
      })
      .catch((err) => {
        console.error('Error in mixpanel getDistinctId', err)
        callback(null)
      })
  },

  /*
  Retrieves current Firebase Cloud Messaging token.
  */
  getPushRegistrationId(callback: (token: ?string) => void) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.getPushRegistrationId()
      .then((token: string) => {
        callback(token)
      })
      .catch((err) => {
        console.error('Error in mixpanel getPushRegistrationId', err)
        callback(null)
      })
  },

  getSuperProperty(propertyName: string, callback: (value: mixed) => void) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.getSuperProperty(propertyName)
      .then((value: mixed) => {
        callback(value)
      })
      .catch((err) => {
        console.error('Error in mixpanel getSuperProperty', err)
        callback(null)
      })
  },

  track(event: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.track(event)
  },

  trackWithProperties(event: string, properties: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.track(event, properties)
  },

  flush() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.flush()
  },

  disableIpAddressGeolocalization() {
      if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

      defaultInstance.disableIpAddressGeolocalization()
  },

  createAlias(alias: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.alias(alias)
  },

  identify(userId: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.identify(userId)
  },

  timeEvent(event: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.timeEvent(event)
  },

  registerSuperProperties(properties: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.registerSuperProperties(properties)
  },

  registerSuperPropertiesOnce(properties: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.registerSuperPropertiesOnce(properties)
  },

  clearSuperProperties() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.clearSuperProperties()
  },

  initPushHandling(token: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.initPushHandling(token)
  },

  set(properties: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.set(properties)
  },

  setOnce(properties: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.setOnce(properties)
  },

  removePushDeviceToken(pushDeviceToken: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.removePushDeviceToken(pushDeviceToken)
  },

  removeAllPushDeviceTokens() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.removeAllPushDeviceTokens()
  },

  trackCharge(charge: number) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.trackCharge(charge)
  },

  trackChargeWithProperties(charge: number, properties: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.trackChargeWithProperties(charge, properties)
  },

  increment(property: string, by: number) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.increment(property, by)
  },

  union(name: string, properties: any[]) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.union(name, properties)
  },

  append(name: string, properties: any[]) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.append(name, properties)
  },

  addPushDeviceToken(token: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.addPushDeviceToken(token)
  },

  // android only
  setPushRegistrationId(token: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.setPushRegistrationId(token)
  },

  // android only
  clearPushRegistrationId(token?: string) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.clearPushRegistrationId(token)
  },

  reset() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.reset()
  },

  showInAppMessageIfAvailable() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)
    defaultInstance.showInAppMessageIfAvailable(token)
  },

  optInTracking() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.optInTracking()
  },

  optOutTracking() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.optOutTracking()
  },
}
