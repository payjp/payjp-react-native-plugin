package jp.pay.reactnative;

import android.text.TextUtils;
import android.widget.Toast;
import androidx.core.os.LocaleListCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import java.util.Locale;
import jp.pay.android.Payjp;
import jp.pay.android.PayjpConfiguration;
import jp.pay.android.cardio.PayjpCardScannerPlugin;

@ReactModule(name = PayjpModule.MODULE_NAME)
public class PayjpModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "Payjp";

  private final ReactApplicationContext reactContext;

  public PayjpModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void test() {
    Toast.makeText(reactContext.getApplicationContext(), "payjp", Toast.LENGTH_SHORT).show();
  }

  @ReactMethod
  public void initialize(ReadableMap arguments) {
    final String publicKey = arguments.getString("publicKey");
    if (publicKey == null) {
      throw new IllegalArgumentException("publicKey is null.");
    }
    final boolean debugEnabled = arguments.getBoolean("debugEnabled");
    final String localeTag = arguments.getString("locale");
    final Locale locale;
    if (!TextUtils.isEmpty(localeTag) && LocaleListCompat.forLanguageTags(localeTag).size() > 0) {
      locale = LocaleListCompat.forLanguageTags(localeTag).get(0);
    } else {
      locale = Locale.getDefault();
    }
    Payjp.init(
        new PayjpConfiguration.Builder(publicKey)
            .setDebugEnabled(debugEnabled)
            .setCardScannerPlugin(PayjpCardScannerPlugin.INSTANCE)
            .setLocale(locale)
            // TODO: .setTokenBackgroundHandler()
            .build()
    );
  }
}