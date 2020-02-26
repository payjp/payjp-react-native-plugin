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

import Foundation
import PassKit
import PAYJP

@objc(RNPAYApplePay)
class PayjpApplePay: RCTEventEmitter {
    private var completionHandler: Any?
}

// MARK: - Bridiging API

@objc extension PayjpApplePay {

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override var methodQueue: DispatchQueue {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String] {
        return ["onApplePayProducedToken", "onApplePayFailedRequestToken", "onApplePayCompleted"]
    }

    func isApplePayAvailable(
        _ resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock) {
        self.methodQueue.async {
            let canMakePayments = PKPaymentAuthorizationViewController.canMakePayments()
            resolver(canMakePayments)
        }
    }

    func makeApplePayToken(
        _ arguments: [String: Any],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock) {
        let request = PKPaymentRequest()
        if let appleMerchantId = arguments["appleMerchantId"] as? String {
            request.merchantIdentifier = appleMerchantId
        }
        if let currencyCode = arguments["currencyCode"] as? String {
            request.currencyCode = currencyCode
        }
        if let countryCode = arguments["countryCode"] as? String {
            request.countryCode = countryCode
        }
        if let label = arguments["summaryItemLabel"] as? String,
            let amount = arguments["summaryItemAmount"] as? String {
            let item = PKPaymentSummaryItem(
                label: label,
                amount: NSDecimalNumber(string: amount)
            )
            request.paymentSummaryItems = [item]
        }
        request.supportedNetworks = self.supportedPaymentNetworks
        request.merchantCapabilities = .capability3DS
        if let requiredBillingAddress = arguments["requiredBillingAddress"] as? Bool, requiredBillingAddress == true {
            request.requiredBillingAddressFields = .postalAddress
        }
        self.methodQueue.async {
            if let authorizationViewController = PKPaymentAuthorizationViewController(paymentRequest: request),
                let rootViewController = UIApplication.shared.keyWindow?.rootViewController {
                authorizationViewController.delegate = self
                rootViewController.present(authorizationViewController, animated: true, completion: nil)
            }
            resolver(true)
        }
    }

    func completeApplePay(
        _ isSuccess: Bool,
        errorMessage: String?,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock) {
        self.methodQueue.async { [weak self] in
            guard let self = self else { return }
            if #available(iOS 11.0, *) {
                guard let completion = self.completionHandler as? (PKPaymentAuthorizationResult) -> Void else {
                    resolver(true)
                    return
                }
                if isSuccess {
                    completion(PKPaymentAuthorizationResult.init(status: .success, errors: nil))
                } else {
                    let errors: [Error]?
                    if let errorMessage = errorMessage {
                        let error = NSError.init(domain: RNPAYErrorDomain,
                                                 code: 0,
                                                 userInfo: [NSLocalizedDescriptionKey: errorMessage])
                        errors = [error]
                    } else {
                        errors = nil
                    }
                    completion(PKPaymentAuthorizationResult.init(status: .failure, errors: errors))
                }
            } else {
                guard let completion = self.completionHandler as? (PKPaymentAuthorizationStatus) -> Void else {
                    resolver(true)
                    return
                }
                if isSuccess {
                    completion(PKPaymentAuthorizationStatus.success)
                } else {
                    completion(PKPaymentAuthorizationStatus.failure)
                }
            }
            self.completionHandler = nil
            resolver(true)
        }
    }
}

// MARK: - Utility

extension PayjpApplePay {
    private var supportedPaymentNetworks: [PKPaymentNetwork] {
        get {
            if #available(iOS 10.0, *) {
                return PKPaymentRequest.availableNetworks()
            } else {
                // .JCB only available >= 10.1
                return [.visa, .masterCard, .amex, .discover]
            }
        }
    }
}

// MARK: - Tokenize

extension PayjpApplePay {
    private func createToken(with paymentToken: PKPaymentToken) {
        APIClient.shared.createToken(with: paymentToken) { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success(let token):
                self.sendEvent(withName: "onApplePayProducedToken", body: token.rawValue)
                break
            case .failure(let error):
                let errorObject: [String: Any] = [
                    "errorType": "applepay",
                    "errorCode": error.errorCode,
                    "errorMessage": error.localizedDescription
                ]
                self.sendEvent(withName: "onApplePayFailedRequestToken", body: errorObject)
                break
            }
        }
    }
}

// MARK: - PKPaymentAuthorizationViewControllerDelegate

extension PayjpApplePay: PKPaymentAuthorizationViewControllerDelegate {

    func paymentAuthorizationViewController(
        _ controller: PKPaymentAuthorizationViewController,
        didAuthorizePayment payment: PKPayment,
        completion: @escaping (PKPaymentAuthorizationStatus) -> Void
    ) {
        if #available(iOS 11.0, *) {/* nothing */} else {
            self.completionHandler = completion
            self.createToken(with: payment.token)
        }
    }

    @available(iOS 11.0, *)
    func paymentAuthorizationViewController(
        _ controller: PKPaymentAuthorizationViewController,
        didAuthorizePayment payment: PKPayment,
        handler completion: @escaping (PKPaymentAuthorizationResult) -> Void
    ) {
        self.completionHandler = completion
        self.createToken(with: payment.token)
    }

    func paymentAuthorizationViewControllerDidFinish(
        _ controller: PKPaymentAuthorizationViewController
    ) {
        if let rootViewController = UIApplication.shared.keyWindow?.rootViewController {
            rootViewController.dismiss(animated: true) { [weak self] in
                self?.sendEvent(withName: "onApplePayCompleted", body: nil)
            }
        }
    }
}
