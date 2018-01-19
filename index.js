// @flow
'use strict'
import { NativeModules } from 'react-native'
const { RNMixpanel } = NativeModules

/*
A Mixpanel target.  Normally there is only one of these.  If you want to log to multiple Mixpanel projects, you can create a new instance of this class with a unique name.  Then call initiaze and you can start logging.
*/
export class MixpanelInstance {
  instanceName: ?string

  constructor(name: ?string) {
    this.instanceName = name
  }

  /*
  Initializes the instance in native land.  Returns a promise that resolves when the instance has been created and is ready for use.
  */
  initialize(apiToken: string): Promise<void> {
    return RNMixpanel.sharedInstanceWithToken(apiToken, this.instanceName)
  }

  getDistinctId(callback: (id: string) => void) {
    RNMixpanel.getDistinctId(this.instanceName, callback) // callbacks have to come last but instanceName is for a rare use case so they are switched when calling the native module
  }

  getSuperProperty(propertyName: string, callback: (value: mixed) => void) {
    RNMixpanel.getSuperProperty(propertyName, this.instanceName, callback)
  }

  track(event: string, properties?: Object) {
    if (properties) {
      RNMixpanel.trackWithProperties(event, properties, this.instanceName)
    } else {
      RNMixpanel.track(event, this.instanceName)
    }
  }

  flush() {
    RNMixpanel.flush(this.instanceName)
  }

  createAlias(alias: string) {
    RNMixpanel.createAlias(alias, this.instanceName)
  }

  identify(userId: string) {
    RNMixpanel.identify(userId, this.instanceName)
  }

  timeEvent(event: string) {
    RNMixpanel.timeEvent(event, this.instanceName)
  }

  registerSuperProperties(properties: Object) {
    RNMixpanel.registerSuperProperties(properties, this.instanceName)
  }

  registerSuperPropertiesOnce(properties: Object) {
    RNMixpanel.registerSuperPropertiesOnce(properties, this.instanceName)
  }

  initPushHandling(token: string) {
    RNMixpanel.initPushHandling(token, this.instanceName)
  }

  set(properties: Object) {
    RNMixpanel.set(properties, this.instanceName)
  }

  setOnce(properties: Object) {
    RNMixpanel.setOnce(properties, this.instanceName)
  }

  removePushDeviceToken(deviceToken: Object) {
    RNMixpanel.removePushDeviceToken(deviceToken, this.instanceName)
  }

  removeAllPushDeviceTokens() {
    RNMixpanel.removeAllPushDeviceTokens(this.instanceName)
  }

  trackCharge(charge: number) {
    RNMixpanel.trackCharge(charge, this.instanceName)
  }

  trackChargeWithProperties(charge: number, properties: Object) {
    RNMixpanel.trackChargeWithProperties(charge, properties, this.instanceName)
  }

  increment(property: string, by: number) {
    RNMixpanel.increment(property, by, this.instanceName)
  }

  addPushDeviceToken(token: string) {
    RNMixpanel.addPushDeviceToken(token, this.instanceName)
  }

  reset() {
    RNMixpanel.reset(this.instanceName)
  }
}

const defaultInstance = new MixpanelInstance(null)

export default {

  sharedInstanceWithToken(apiToken: string) {
    defaultInstance.initialize(apiToken)
  },

  getDistinctId(callback: (id: string) => void) {
    defaultInstance.getDistinctId(callback) // callbacks have to come last but instanceName is for a rare use case so they are switched when calling the native module
  },

  getSuperProperty(propertyName: string, callback: (value: mixed) => void) {
    defaultInstance.getSuperProperty(propertyName, callback)
  },

  track(event: string) {
    defaultInstance.track(event)
  },

  trackWithProperties(event: string, properties: Object) {
    defaultInstance.track(event, properties)
  },

  flush() {
    defaultInstance.flush()
  },

  createAlias(alias: string) {
    defaultInstance.createAlias(alias)
  },

  identify(userId: string) {
    defaultInstance.identify(userId)
  },

  timeEvent(event: string) {
    defaultInstance.timeEvent(event)
  },

  registerSuperProperties(properties: Object) {
    defaultInstance.registerSuperProperties(properties)
  },

  registerSuperPropertiesOnce(properties: Object) {
    defaultInstance.registerSuperPropertiesOnce(properties)
  },

  initPushHandling(token: string) {
    defaultInstance.initPushHandling(token)
  },

  set(properties: Object) {
    defaultInstance.set(properties)
  },

  setOnce(properties: Object) {
    defaultInstance.setOnce(properties)
  },

  removePushDeviceToken(deviceToken: Object) {
    defaultInstance.removePushDeviceToken(deviceToken)
  },

  removeAllPushDeviceTokens() {
    defaultInstance.removeAllPushDeviceTokens()
  },

  trackCharge(charge: number) {
    defaultInstance.trackCharge(charge)
  },

  trackChargeWithProperties(charge: number, properties: Object) {
    defaultInstance.trackChargeWithProperties(charge, properties)
  },

  increment(property: string, by: number) {
    defaultInstance.increment(property, by)
  },

  addPushDeviceToken(token: string) {
    defaultInstance.addPushDeviceToken(token)
  },

  reset() {
    defaultInstance.reset()
  },
}
