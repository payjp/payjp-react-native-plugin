/*
 *
 * Copyright (c) 2020 PAY, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package jp.pay.reactnative;

import android.text.TextUtils;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.os.LocaleListCompat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import java.util.Locale;
import jp.pay.android.Payjp;
import jp.pay.android.PayjpConfiguration;
import jp.pay.android.PayjpTokenBackgroundHandler;
import jp.pay.android.cardio.PayjpCardScannerPlugin;

@ReactModule(name = PayjpModule.MODULE_NAME)
public class PayjpModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "RNPAYCore";

  @NonNull private final ReactApplicationContext reactContext;
  @Nullable private final PayjpTokenBackgroundHandler tokenBackgroundHandler;

  public PayjpModule(
      @NonNull ReactApplicationContext reactContext,
      @Nullable PayjpTokenBackgroundHandler tokenBackgroundHandler
  ) {
    super(reactContext);
    this.reactContext = reactContext;
    this.tokenBackgroundHandler = tokenBackgroundHandler;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void initialize(ReadableMap arguments, @NonNull Promise promise) {
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
            .setTokenBackgroundHandler(tokenBackgroundHandler)
            .build()
    );
    promise.resolve(null);
  }
}