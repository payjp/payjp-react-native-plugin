package jp.pay.reactnative;

import androidx.annotation.NonNull;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

public class PayjpReactNativePackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    PayjpCardFormModule cardFormModule = new PayjpCardFormModule(reactContext);
    return Arrays.<NativeModule>asList(
        new PayjpModule(reactContext, cardFormModule),
        cardFormModule
    );
  }

  // Deprecated from RN 0.47
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}