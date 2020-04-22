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
package jp.pay.reactnative

import androidx.core.os.LocaleListCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import jp.pay.android.Payjp
import jp.pay.android.PayjpConfiguration
import jp.pay.android.PayjpTokenBackgroundHandler
import jp.pay.android.cardio.PayjpCardScannerPlugin
import jp.pay.android.model.ClientInfo
import java.util.Locale

@ReactModule(name = PayjpModule.MODULE_NAME)
class PayjpModule(
  private val reactContext: ReactApplicationContext,
  private val tokenBackgroundHandler: PayjpTokenBackgroundHandler?
) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    const val MODULE_NAME = "RNPAYCore"
  }

  override fun getName(): String = MODULE_NAME

  @ReactMethod fun initialize(
    arguments: ReadableMap,
    promise: Promise
  ) {
    val publicKey = checkNotNull(arguments.getString("publicKey")) {
      "publicKey is null."
    }
    val debugEnabled = arguments.getBoolean("debugEnabled")
    val locale = arguments.getString("locale")?.let { tag ->
      LocaleListCompat.forLanguageTags(tag)
          .takeIf { it.size() > 0 }
          ?.get(0)
    } ?: Locale.getDefault()
    val clientInfo = ClientInfo.Builder()
        .setPlugin("jp.pay.reactnative/${BuildConfig.VERSION_NAME}")
        .setPublisher("payjp")
        .build()
    val tdsRedirectKey = arguments.getString("threeDSecureRedirectKey")
    Payjp.init(
        PayjpConfiguration.Builder(publicKey)
            .setDebugEnabled(debugEnabled)
            .setTokenBackgroundHandler(tokenBackgroundHandler)
            .setLocale(locale)
            .setCardScannerPlugin(PayjpCardScannerPlugin)
            .setClientInfo(clientInfo)
            .setThreeDSecureRedirectName(tdsRedirectKey)
            .build()
    )
    promise.resolve(null)
  }
}
