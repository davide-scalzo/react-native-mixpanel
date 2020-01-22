declare module 'react-native-mixpanel' {
  export class MixpanelInstance {
    constructor(apiToken?: string, optOutTrackingDefault?: boolean, trackCrashes?: boolean, automaticPushTracking?: boolean, launchOptions?: Object)

    initialize(): Promise<void>
    getDistinctId(): Promise<string>
    getSuperProperty(propertyName: string): Promise<any>
    track(event: string, properties?: Object): Promise<void>
    flush(): Promise<void>
    disableIpAddressGeolocalization(): Promise<void>
    alias(alias: string, oldDistinctID?: string): Promise<void>
    identify(userId: string): Promise<void>
    addGroup(groupKey: string, groupId: string): Promise<void>
    setGroup(groupKey: string, groupId: string): Promise<void>
    timeEvent(event: string): Promise<void>
    registerSuperProperties(properties: Object): Promise<void>
    registerSuperPropertiesOnce(properties: Object): Promise<void>
    initPushHandling(token: string): Promise<void>
    set(properties: Object): Promise<void>
    setOnce(properties: Object): Promise<void>
    trackCharge(charge: number): Promise<void>
    trackChargeWithProperties(charge: number, properties: Object): Promise<void>
    increment(property: string, by: number): Promise<void>
    union(name: string, properties: any[]): Promise<void>
    append(name: string, properties: any[]): Promise<void>
    clearSuperProperties(): Promise<void>
    reset(): Promise<void>
    showInAppMessageIfAvailable(): Promise<void>
    optInTracking(): Promise<void>
    optOutTracking(): Promise<void>

    // android only
    setPushRegistrationId(token: string): Promise<void>
    clearPushRegistrationId(token?: string): Promise<void>
    getPushRegistrationId(): Promise<string>

    // iOS only
    removePushDeviceToken(pushDeviceToken: string): Promise<void>
    removeAllPushDeviceTokens(): Promise<void>
    addPushDeviceToken(token: string): Promise<void>
  }

  interface MixpanelAPI {
    sharedInstanceWithToken(apiToken: string, optOutTrackingDefault?: boolean, trackCrashes?: boolean, automaticPushTracking?: boolean, launchOptions?: Object): Promise<void>;
    getDistinctId(callback: (id?: string) => void): void;
    getSuperProperty(propertyName: string, callback: (value: any) => void): void;
    track(event: string): void;
    trackWithProperties(event: string, properties: Object): void;
    flush(): void;
    disableIpAddressGeolocalization(): void;
    createAlias(alias: string, oldDistinctID?: string): void;
    identify(userId: string): void;
    addGroup(groupKey: string, groupId: string): void;
    setGroup(groupKey: string, groupId: string): void;
    timeEvent(event: string): void;
    registerSuperProperties(properties: Object): void;
    registerSuperPropertiesOnce(properties: Object): void;
    initPushHandling(token: string): void;
    set(properties: Object): void;
    setOnce(properties: Object): void;
    trackCharge(charge: number): void;
    trackChargeWithProperties(charge: number, properties: Object): void;
    increment(property: string, by: number): void;
    union(name: string, properties: any[]): void;
    append(name: string, properties: any[]): void;
    clearSuperProperties(): void;
    reset(): void;
    showInAppMessageIfAvailable(): void;
    optInTracking(): void
    optOutTracking(): void

    // android only
    setPushRegistrationId(token: string): void;
    clearPushRegistrationId(token?: string): void;
    getPushRegistrationId(callback: (token?: string) => void): void;

    // iOS only
    addPushDeviceToken(token: string): void;
    removePushDeviceToken(pushDeviceToken: string): void;
    removeAllPushDeviceTokens(): void;
  }

  const mixpanelApi: MixpanelAPI;
  export default mixpanelApi;

}
