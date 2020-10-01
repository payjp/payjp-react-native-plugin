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

import android.app.Activity
import android.content.Intent
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import jp.pay.android.Payjp
import jp.pay.android.PayjpCardForm
import jp.pay.android.PayjpTokenBackgroundHandler
import jp.pay.android.PayjpTokenBackgroundHandler.CardFormStatus
import jp.pay.android.model.TenantId
import jp.pay.android.model.Token
import jp.pay.android.model.toJsonValue
import jp.pay.android.ui.PayjpCardFormResult
import jp.pay.android.ui.PayjpCardFormResultCallback
import java.util.concurrent.CountDownLatch
import java.util.concurrent.atomic.AtomicReference

@ReactModule(name = PayjpCardFormModule.MODULE_NAME)
class PayjpCardFormModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), ActivityEventListener, PayjpTokenBackgroundHandler {

  companion object {
    const val MODULE_NAME = "RNPAYCardForm"
    private const val CODE_START_CARD_FORM = 1
  }

  private val mainThreadHandler: Handler = Handler(Looper.getMainLooper())
  private val reference: AtomicReference<CardFormStatus> = AtomicReference()
  @Volatile
  private var countDownLatch: CountDownLatch? = null
  private var deviceEventEmitter: RCTDeviceEventEmitter? = null

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName(): String = MODULE_NAME

  @ReactMethod fun startCardForm(
    tenantIdString: String?,
    cardFormType: String?,
    promise: Promise
  ) {
    val face = when (cardFormType) {
      "cardDisplay" -> PayjpCardForm.FACE_CARD_DISPLAY
      else -> PayjpCardForm.FACE_MULTI_LINE
    }
    mainThreadHandler.post {
      reactContext.currentActivity?.let { activity ->
        val tenantId = tenantIdString?.let { TenantId(it) }
        Payjp.cardForm().start(activity, CODE_START_CARD_FORM, tenantId, face)
      }
      promise.resolve(null)
    }
  }

  @ReactMethod fun showTokenProcessingError(
    message: String,
    promise: Promise
  ) {
    reference.set(CardFormStatus.Error(message = message))
    countDownLatch?.countDown()
    promise.resolve(null)
  }

  @ReactMethod fun completeCardForm(promise: Promise) {
    reference.set(CardFormStatus.Complete())
    countDownLatch?.countDown()
    promise.resolve(null)
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
    Payjp.cardForm().handleResult(data, object : PayjpCardFormResultCallback {
      override fun onResult(result: PayjpCardFormResult) {
        if (result.isSuccess()) {
          deviceEventEmitterSafety.emit("onCardFormCompleted", null)
        } else if (result.isCanceled()) {
          deviceEventEmitterSafety.emit("onCardFormCanceled", null)
        }
      }
    })
  }

  override fun onNewIntent(intent: Intent) {}

  override fun handleTokenInBackground(token: Token): CardFormStatus {
    countDownLatch = CountDownLatch(1)
    val tokenMap = Arguments.makeNativeMap(token.toJsonValue())
    mainThreadHandler.post {
      deviceEventEmitterSafety.emit("onCardFormProducedToken", tokenMap)
    }
    try {
      countDownLatch?.await()
    } catch (e: InterruptedException) {
      throw RuntimeException(e)
    }
    return reference.get()
  }

  private val deviceEventEmitterSafety: RCTDeviceEventEmitter
    get() = deviceEventEmitter ?: reactContext.getJSModule(
        RCTDeviceEventEmitter::class.java
    ).also { deviceEventEmitter = it }
}
