package jp.pay.reactnative;

import android.app.Activity;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;
import jp.pay.android.Payjp;
import jp.pay.android.PayjpTokenBackgroundHandler;
import jp.pay.android.model.Serializers;
import jp.pay.android.model.TenantId;
import jp.pay.android.model.Token;
import jp.pay.android.ui.PayjpCardFormResult;
import jp.pay.android.ui.PayjpCardFormResultCallback;

@ReactModule(name = PayjpCardFormModule.MODULE_NAME)
public class PayjpCardFormModule extends ReactContextBaseJavaModule implements
    ActivityEventListener, PayjpTokenBackgroundHandler {
  public static final String MODULE_NAME = "PayjpCardForm";
  private static final int CODE_START_CARD_FORM = 1;

  @NonNull private final ReactApplicationContext reactContext;
  @NonNull private final Handler mainThreadHandler;
  @NonNull private final AtomicReference<CardFormStatus> reference;
  @Nullable private volatile CountDownLatch countDownLatch;
  @Nullable private DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter;

  public PayjpCardFormModule(@NonNull ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.mainThreadHandler = new Handler(Looper.getMainLooper());
    this.reference = new AtomicReference<>();
    reactContext.addActivityEventListener(this);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void startCardForm(@Nullable String tenantIdString) {
    final Activity activity = reactContext.getCurrentActivity();
    if (activity != null) {
      final TenantId tenantId = tenantIdString != null ? new TenantId(tenantIdString) : null;
      Payjp.cardForm().start(activity, CODE_START_CARD_FORM, tenantId);
    }
  }

  @ReactMethod
  public void showTokenProcessingError(@NonNull String message) {
    reference.set(new CardFormStatus.Error(message));
    if (countDownLatch != null) {
      countDownLatch.countDown();
    }
  }

  @ReactMethod
  public void completeCardForm() {
    reference.set(new CardFormStatus.Complete());
    if (countDownLatch != null) {
      countDownLatch.countDown();
    }
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    Payjp.cardForm().handleResult(data, new PayjpCardFormResultCallback() {
      @Override public void onResult(@NonNull PayjpCardFormResult result) {
        if (result.isSuccess()) {
          getDeviceEventEmitterSafety().emit("onCardFormCompleted", null);
        } else if (result.isCanceled()) {
          getDeviceEventEmitterSafety().emit("onCardFormCanceled", null);
        }
      }
    });
  }

  @Override public void onNewIntent(Intent intent) {
  }

  @NonNull @Override public CardFormStatus handleTokenInBackground(@NonNull Token token) {
    countDownLatch = new CountDownLatch(1);
    final WritableMap tokenMap = Arguments.makeNativeMap(Serializers.toJsonValue(token));
    mainThreadHandler.post(new Runnable() {
      @Override public void run() {
        getDeviceEventEmitterSafety().emit("onCardFormProducedToken", tokenMap);
      }
    });
    try {
      countDownLatch.await();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
    return reference.get();
  }

  @NonNull private DeviceEventManagerModule.RCTDeviceEventEmitter getDeviceEventEmitterSafety() {
    if (deviceEventEmitter == null) {
      deviceEventEmitter =
          reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }
    return deviceEventEmitter;
  }
}