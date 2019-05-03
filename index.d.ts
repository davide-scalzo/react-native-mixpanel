declare module 'react-native-mixpanel' {
  export class MixpanelInstance {
    constructor(apiToken?: string)

    initialize(): Promise<void>
    getDistinctId(): Promise<string>  
    getSuperProperty(propertyName: string): Promise<any>
    track(event: string, properties?: Object): Promise<void>
    flush(): Promise<void>
    disableIpAddressGeolocalization(): Promise<void>
    alias(alias: string): Promise<void>
    identify(userId: string): Promise<void>  
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
    removePushDeviceToken(deviceToken: Object): Promise<void>
    removeAllPushDeviceTokens(): Promise<void>
    addPushDeviceToken(token: string): Promise<void>

    // android only
    setPushRegistrationId(token: string): Promise<void>
  
    // android only
    clearPushRegistrationId(): Promise<void>

    reset(): Promise<void>
  }

  interface MixpanelAPI {
    sharedInstanceWithToken(apiToken: string): Promise<void>;
    getDistinctId(callback: (id?: string) => void): void;
    getSuperProperty(propertyName: string, callback: (value: any) => void): void;
    track(event: string): void;
    trackWithProperties(event: string, properties: Object): void;
    flush(): void;
    disableIpAddressGeolocalization(): void;
    createAlias(alias: string): void;
    identify(userId: string): void;
    timeEvent(event: string): void;
    registerSuperProperties(properties: Object): void;
    registerSuperPropertiesOnce(properties: Object): void;
    initPushHandling(token: string): void;
    set(properties: Object): void;
    setOnce(properties: Object): void;
    removePushDeviceToken(deviceToken: Object): void;
    removeAllPushDeviceTokens(): void;
    trackCharge(charge: number): void;
    trackChargeWithProperties(charge: number, properties: Object): void;
    increment(property: string, by: number): void;
    union(name: string, properties: any[]): void;
    addPushDeviceToken(token: string): void;
  
    // android only
    setPushRegistrationId(token: string): void;
  
    // android only
    clearPushRegistrationId(): void;

    reset(): void;
  }

  const mixpanelApi: MixpanelAPI;
  export default mixpanelApi;
  
}