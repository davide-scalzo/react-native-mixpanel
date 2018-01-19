// @flow
'use strict'
import { NativeModules } from 'react-native'
const { RNMixpanel } = NativeModules

/*
A Mixpanel target.  Normally there is only one of these.  If you want to log to multiple Mixpanel projects, you can create a new instance of this class with a unique name.  Then call initiaze and you can start logging.
*/
export class MixpanelInstance {
  apiToken: ?string

  constructor(apiToken: ?string) {
    this.apiToken = apiToken
  }

  /*
  Initializes the instance in native land.  Returns a promise that resolves when the instance has been created and is ready for use.
  */
  initialize(): Promise<void> {
    return RNMixpanel.sharedInstanceWithToken(this.apiToken)
  }

  getDistinctId(callback: (id: string) => void) {
    RNMixpanel.getDistinctId(this.apiToken, callback) // callbacks have to come last but token is for a rare use case so they are switched when calling the native module
  }

  getSuperProperty(propertyName: string, callback: (value: mixed) => void) {
    RNMixpanel.getSuperProperty(propertyName, this.apiToken, callback)
  }

  track(event: string, properties?: Object) {
    if (properties) {
      RNMixpanel.trackWithProperties(event, properties, this.apiToken)
    } else {
      RNMixpanel.track(event, this.apiToken)
    }
  }

  flush() {
    RNMixpanel.flush(this.apiToken)
  }

  createAlias(alias: string) {
    RNMixpanel.createAlias(alias, this.apiToken)
  }

  identify(userId: string) {
    RNMixpanel.identify(userId, this.apiToken)
  }

  timeEvent(event: string) {
    RNMixpanel.timeEvent(event, this.apiToken)
  }

  registerSuperProperties(properties: Object) {
    RNMixpanel.registerSuperProperties(properties, this.apiToken)
  }

  registerSuperPropertiesOnce(properties: Object) {
    RNMixpanel.registerSuperPropertiesOnce(properties, this.apiToken)
  }

  initPushHandling(token: string) {
    RNMixpanel.initPushHandling(token, this.apiToken)
  }

  set(properties: Object) {
    RNMixpanel.set(properties, this.apiToken)
  }

  setOnce(properties: Object) {
    RNMixpanel.setOnce(properties, this.apiToken)
  }

  removePushDeviceToken(deviceToken: Object) {
    RNMixpanel.removePushDeviceToken(deviceToken, this.apiToken)
  }

  removeAllPushDeviceTokens() {
    RNMixpanel.removeAllPushDeviceTokens(this.apiToken)
  }

  trackCharge(charge: number) {
    RNMixpanel.trackCharge(charge, this.apiToken)
  }

  trackChargeWithProperties(charge: number, properties: Object) {
    RNMixpanel.trackChargeWithProperties(charge, properties, this.apiToken)
  }

  increment(property: string, by: number) {
    RNMixpanel.increment(property, by, this.apiToken)
  }

  addPushDeviceToken(token: string) {
    RNMixpanel.addPushDeviceToken(token, this.apiToken)
  }

  reset() {
    RNMixpanel.reset(this.apiToken)
  }
}

let defaultInstance:?MixpanelInstance = null
const NO_INSTANCE_ERROR = 'No mixpanel instance created yet.  You must call sharedInstanceWithToken before anything else and should wait for its promise to fulfill before others calls to avoid any internal native issue.'

export default {

  sharedInstanceWithToken(apiToken: string): Promise<void> {
    const instance = new MixpanelInstance(apiToken)
    if (!defaultInstance) defaultInstance = instance
    return instance.initialize()
  },

  getDistinctId(callback: (id: string) => void) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.getDistinctId(callback) // callbacks have to come last but token is for a rare use case so they are switched when calling the native module
  },

  getSuperProperty(propertyName: string, callback: (value: mixed) => void) {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.getSuperProperty(propertyName, callback)
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

    defaultInstance.createAlias(alias)
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

  reset() {
    if (!defaultInstance) throw new Error(NO_INSTANCE_ERROR)

    defaultInstance.reset()
  },
}
