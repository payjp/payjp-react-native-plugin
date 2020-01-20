
package jp.pay.reactnative;

import android.os.Build;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNPayjpModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNPayjpModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNPayjp";
  }

  @ReactMethod
  public void getOSVersion(Promise promise) {
    promise.resolve(Build.VERSION.SDK_INT);
  }
}