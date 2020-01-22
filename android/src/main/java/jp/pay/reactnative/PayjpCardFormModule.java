package jp.pay.reactnative;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = PayjpCardFormModule.MODULE_NAME)
public class PayjpCardFormModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "PayjpCardForm";

  private final ReactApplicationContext reactContext;

  public PayjpCardFormModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void startCardForm(@Nullable String tenantId) {
    // TODO
  }
}