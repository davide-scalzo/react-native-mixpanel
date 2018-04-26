package com.kevinejohn.RNMixpanel;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.mixpanel.android.mpmetrics.MixpanelAPI;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Mixpanel React Native module.
 * Note that synchronized(instance) is used in methods because that's what MixpanelAPI.java recommends you do if you are keeping instances.
 */
public class RNMixpanelModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private Map<String, MixpanelAPI> instances;

    public RNMixpanelModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Get lifecycle notifications to flush mixpanel on pause or destroy
        reactContext.addLifecycleEventListener(this);
    }

    /*
    Gets the mixpanel api instance for the given token.  It must have been created in sharedInstanceWithToken first.
     */
    private MixpanelAPI getInstance(final String apiToken) {
        if (instances == null) {
            return null;
        }
        return instances.get(apiToken);
    }

    @Override
    public String getName() {
        return "RNMixpanel";
    }

    // Is there a better way to convert ReadableMap to JSONObject?
    // I only found this:
    // https://github.com/andpor/react-native-sqlite-storage/blob/master/src/android/src/main/java/org/pgsqlite/SQLitePluginConverter.java
    static JSONObject reactToJSON(ReadableMap readableMap) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while(iterator.hasNextKey()){
            String key = iterator.nextKey();
            ReadableType valueType = readableMap.getType(key);
            switch (valueType){
                case Null:
                    jsonObject.put(key,JSONObject.NULL);
                    break;
                case Boolean:
                    jsonObject.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    jsonObject.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    jsonObject.put(key, readableMap.getString(key));
                    break;
                case Map:
                    jsonObject.put(key, reactToJSON(readableMap.getMap(key)));
                    break;
                case Array:
                    jsonObject.put(key, reactToJSON(readableMap.getArray(key)));
                    break;
            }
        }

        return jsonObject;
    }

    static JSONArray reactToJSON(ReadableArray readableArray) throws JSONException {
        JSONArray jsonArray = new JSONArray();
        for(int i=0; i < readableArray.size(); i++) {
            ReadableType valueType = readableArray.getType(i);
            switch (valueType){
                case Null:
                    jsonArray.put(JSONObject.NULL);
                    break;
                case Boolean:
                    jsonArray.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    jsonArray.put(readableArray.getDouble(i));
                    break;
                case String:
                    jsonArray.put(readableArray.getString(i));
                    break;
                case Map:
                    jsonArray.put(reactToJSON(readableArray.getMap(i)));
                    break;
                case Array:
                    jsonArray.put(reactToJSON(readableArray.getArray(i)));
                    break;
            }
        }
        return jsonArray;
    }


    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
        if (instances != null) {
            for (MixpanelAPI instance : instances.values()) {
                instance.flush();
            }
        }
    }

    @Override
    public void onHostDestroy() {
        if (instances != null) {
            for (MixpanelAPI instance : instances.values()) {
                instance.flush();
            }
        }
    }

    @ReactMethod
    public void sharedInstanceWithToken(final String token, Promise promise) {
        synchronized (this) {
            // an instance can pre-exist when reloading javascript
            if (instances != null && instances.containsKey(token)) {
                promise.resolve(null);
                return;
            }
            final ReactApplicationContext reactApplicationContext = this.getReactApplicationContext();
            if (reactApplicationContext == null) {
                promise.reject(new Throwable("no React application context"));
                return;
            }
            final MixpanelAPI instance = MixpanelAPI.getInstance(reactApplicationContext, token);
            Map<String, MixpanelAPI> newInstances = new HashMap<>();
            if (instances != null) {
                newInstances.putAll(instances);
            }
            newInstances.put(token, instance);
            instances = Collections.unmodifiableMap(newInstances);
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void track(final String name, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.track(name);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void trackWithProperties(final String name, final ReadableMap properties, final String apiToken, Promise promise) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.track(name, obj);
        }
        promise.resolve(null);
    }


    @ReactMethod
    public void createAlias(final String old_id, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.alias(old_id, instance.getDistinctId());
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void identify(final String user_id, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.identify(user_id);
            instance.getPeople().identify(user_id);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void timeEvent(final String event, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.timeEvent(event);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void registerSuperProperties(final ReadableMap properties, final String apiToken, Promise promise) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.registerSuperProperties(obj);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void registerSuperPropertiesOnce(final ReadableMap properties, final String apiToken, Promise promise) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.registerSuperPropertiesOnce(obj);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void initPushHandling (final String token, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().initPushHandling(token);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void set(final ReadableMap properties, final String apiToken, Promise promise) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().set(obj);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void setOnce(final ReadableMap properties, final String apiToken, Promise promise) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().setOnce(obj);
        }
        promise.resolve(null);
    }


    // Android only
    @ReactMethod
    public void setPushRegistrationId(final String token, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().setPushRegistrationId(token);
        }
        promise.resolve(null);
    }

    // Android only
    @ReactMethod
    public void clearPushRegistrationId(final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().clearPushRegistrationId();
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void trackCharge(final double charge, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().trackCharge(charge, null);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void trackChargeWithProperties(final double charge, final ReadableMap properties, final String apiToken, Promise promise) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().trackCharge(charge, obj);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void increment(final String property, final double count, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.getPeople().increment(property, count);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void reset(final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.reset();
            instance.flush();
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void flush(final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            instance.flush();
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void getSuperProperty(final String property, final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        synchronized(instance) {
            try {
                JSONObject currProps = instance.getSuperProperties();
                promise.resolve(currProps.getString(property));
            } catch (JSONException e) {
                promise.reject(e);
            }
        }
    }

    @ReactMethod
    public void getDistinctId(final String apiToken, Promise promise) {
        final MixpanelAPI instance = getInstance(apiToken);
        if (instance == null) {
            promise.reject(new Throwable("no mixpanel instance available."));
            return;
        }
        synchronized(instance) {
            promise.resolve(instance.getDistinctId());
        }
    }
}
