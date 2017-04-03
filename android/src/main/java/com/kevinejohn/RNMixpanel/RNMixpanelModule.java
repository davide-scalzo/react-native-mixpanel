package com.kevinejohn.RNMixpanel;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
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

/**
 * Created by KevinEJohn on 2/11/16.
 */
public class RNMixpanelModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    ReactApplicationContext reactContext;
    MixpanelAPI mixpanel;

    public RNMixpanelModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        // Get lifecycle notifications to flush mixpanel on pause or destroy
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "RNMixpanel";
    }

    @ReactMethod
    public void sharedInstanceWithToken(final String token) {
        mixpanel = MixpanelAPI.getInstance(reactContext, token);

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


    @ReactMethod
    public void track(final String name) {
        mixpanel.track(name);
    }

    @ReactMethod
    public void trackWithProperties(final String name, final ReadableMap properties) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mixpanel.track(name, obj);
    }

    @ReactMethod
    public void createAlias(final String old_id) {
        mixpanel.alias(old_id, mixpanel.getDistinctId());
    }

    @ReactMethod
    public void identify(final String user_id) {
        mixpanel.identify(user_id);
        mixpanel.getPeople().identify(user_id);
    }

    @ReactMethod
    public void timeEvent(final String event) {
        mixpanel.timeEvent(event);
    }

    @ReactMethod
    public void registerSuperProperties(final ReadableMap properties) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mixpanel.registerSuperProperties(obj);
    }

    @ReactMethod
    public void registerSuperPropertiesOnce(final ReadableMap properties) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mixpanel.registerSuperPropertiesOnce(obj);
    }

    @ReactMethod
    public void initPushHandling (final String token) {
        mixpanel.getPeople().initPushHandling(token);
    }



    @ReactMethod
    public void set(final ReadableMap properties) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mixpanel.getPeople().set(obj);
    }

    @ReactMethod
    public void setOnce(final ReadableMap properties) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mixpanel.getPeople().setOnce(obj);
    }


    // Android only
    @ReactMethod
    public void setPushRegistrationId(final String token) {
        mixpanel.getPeople().setPushRegistrationId(token);
    }

    // Android only
    @ReactMethod
    public void clearPushRegistrationId() {
        mixpanel.getPeople().clearPushRegistrationId();
    }

    @ReactMethod
    public void trackCharge(final double charge) {
        mixpanel.getPeople().trackCharge(charge, null);
    }

    @ReactMethod
    public void trackChargeWithProperties(final double charge, final ReadableMap properties) {
        JSONObject obj = null;
        try {
            obj = RNMixpanelModule.reactToJSON(properties);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mixpanel.getPeople().trackCharge(charge, obj);
    }

    @ReactMethod
    public void increment(final String property, final double count) {
        mixpanel.getPeople().increment(property, count);
    }

    @ReactMethod
    public void reset() {
        mixpanel.reset();
        mixpanel.flush();
    }

    @ReactMethod
    public void flush() {
        mixpanel.flush();
    }

    @Override
    public void onHostResume() {
        // Actvity `onResume`
    }

    @Override
    public void onHostPause() {
        // Actvity `onPause`

        if (mixpanel != null) {
            mixpanel.flush();
        }
    }

    @Override
    public void onHostDestroy() {
        // Actvity `onDestroy`

        if (mixpanel != null) {
            mixpanel.flush();
        }
    }

    @ReactMethod
    public void getSuperProperty(final String property, Callback callback) {
        String[] prop = new String[1];

        try {
            JSONObject currProps = mixpanel.getSuperProperties();
            prop[0] = currProps.getString(property);
            callback.invoke(prop);
        } catch (JSONException e) {
            prop[0] = null;
            callback.invoke(prop);
        }
    }

    @ReactMethod
    public void getDistinctId(Callback callback) {
        callback.invoke(mixpanel.getDistinctId());
    }
}
