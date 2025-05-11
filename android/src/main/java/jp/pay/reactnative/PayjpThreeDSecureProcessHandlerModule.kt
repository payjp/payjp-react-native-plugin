package jp.pay.reactnative

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import jp.pay.android.verifier.PayjpVerifier
import jp.pay.android.verifier.ui.PayjpThreeDSecureResult
import jp.pay.android.verifier.ui.PayjpThreeDSecureResultCallback


@ReactModule(name = PayjpThreeDSecureProcessHandlerModule.MODULE_NAME)
class PayjpThreeDSecureProcessHandlerModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  companion object {
    const val MODULE_NAME = "RNPAYThreeDSecureProcessHandler"
  }

  private var pendingPromise: Promise? = null

  override fun getName(): String = MODULE_NAME

  init {
    reactContext.addActivityEventListener(this)
  }

  @ReactMethod
  fun startThreeDSecureProcess(resourceId: String, promise: Promise) {
    val activity: Activity? = reactContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Current activity is null")
      return
    }
    if (pendingPromise != null) {
      promise.reject("PENDING_OPERATION", "Another 3DS process is already in progress.")
      return
    }
    this.pendingPromise = promise
    PayjpVerifier.startThreeDSecureFlow(resourceId, activity)
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
    pendingPromise?.let { promise ->
      PayjpVerifier.handleThreeDSecureResult(requestCode, object : PayjpThreeDSecureResultCallback {
        override fun onResult(result: PayjpThreeDSecureResult) {
          when (result) {
            is PayjpThreeDSecureResult.SuccessResourceId -> {
              promise.resolve(null)
            }
            PayjpThreeDSecureResult.Canceled -> {
              promise.reject("THREE_D_SECURE_CANCELED", "ThreeDSecure process was canceled by user.")
            }
            else -> {
              promise.reject("THREE_D_SECURE_UNKNOWN", "Unknown ThreeDSecure result.")
            }
          }
          pendingPromise = null
        }
      })
    }
  }

  override fun onNewIntent(intent: Intent?) {}
}
