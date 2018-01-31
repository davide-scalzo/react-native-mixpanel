// @flow
'use strict'
import { NativeModules } from 'react-native'
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
  initialized: boolean

  constructor(apiToken: ?string) {
    this.apiToken = apiToken
    this.initialized = false
  }

  /*
  Initializes the instance in native land.  Returns a promise that resolves when the instance has been created and is ready for use.
  */
  initialize(): Promise<void> {
    return RNMixpanel.sharedInstanceWithToken(this.apiToken)
      .then(() => {
        this.initialized = true
      })
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
  Gets the given super property.  Returns a promise that resolves to the value.
  */
  getSuperProperty(propertyName: string): Promise<mixed> {
    if (!this.initialized) {
      return Promise.reject(new Error(uninitializedError('getDistinctId')))
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

  removePushDeviceToken(deviceToken: Object): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('removePushDeviceToken'))

    return RNMixpanel.removePushDeviceToken(deviceToken, this.apiToken)
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
  clearPushRegistrationId(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('clearPushRegistrationId'))

    if (!RNMixpanel.clearPushRegistrationId) throw new Error('No native implementation for setPusclearPushRegistrationIdhRegistrationId.  This is Android only.')
    return RNMixpanel.clearPushRegistrationId()
  }

  reset(): Promise<void> {
    if (!this.initialized) throw new Error(uninitializedError('reset'))

    return RNMixpanel.reset(this.apiToken)
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

  sharedInstanceWithToken(apiToken: string): Promise<void> {
    const instance = new MixpanelInstance(apiToken)
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

  removePushDeviceToken(deviceToken: Object) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.removePushDeviceToken(deviceToken)
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
  clearPushRegistrationId() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.clearPushRegistrationId()
  },

  reset() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.reset()
  },

}
