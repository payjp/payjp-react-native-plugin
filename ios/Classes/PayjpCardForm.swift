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
import PAYJP

@objc(RNPAYCardForm)
class PayjpCardForm: RCTEventEmitter {
    private var style: FormStyle = .defalutStyle
    private var completionHandler: ((Error?) -> Void)?
}

// MARK: - Bridiging API

@objc extension PayjpCardForm {

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override var methodQueue: DispatchQueue {
        return DispatchQueue.main
    }

    override func supportedEvents() -> [String] {
        return ["onCardFormCanceled", "onCardFormCompleted", "onCardFormProducedToken"]
    }

    func startCardForm(
        _ tenantId: String?,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock) {
        let description = Bundle.main.object(forInfoDictionaryKey: "NSCameraUsageDescription") as? String
        assert(description?.isEmpty == false, "The app's Info.plist must contain an NSCameraUsageDescription key to use scanner in card form.")
        self.methodQueue.async { [weak self] in
            guard let self = self else { return }
            let cardForm = CardFormViewController.createCardFormViewController(style: self.style,
                                                                               tenantId: tenantId)
            cardForm.delegate = self
            if let hostViewController = UIApplication.shared.keyWindow?.rootViewController {
                if let navigationController = hostViewController as? UINavigationController {
                    navigationController.pushViewController(cardForm, animated: true)
                } else {
                    let navigationController = UINavigationController.init(rootViewController: cardForm)
                    hostViewController.present(navigationController, animated: true, completion: nil)
                }
            }
            resolver(true)
        }
    }

    func completeCardForm(
        _ resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock) {
        if let completionHandler = self.completionHandler {
            completionHandler(nil)
            self.completionHandler = nil
        }
        resolver(true)
    }

    func showTokenProcessingError(
        _ message: String,
        resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock) {
        if let completionHandler = self.completionHandler {
            let error = NSError.init(domain: RNPAYErrorDomain,
                                     code: 0,
                                     userInfo: [NSLocalizedDescriptionKey: message])
            completionHandler(error)
            self.completionHandler = nil
        }
        resolver(true)
    }

    func setFormStyle(
        _ style: [String: Any]?,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock) {
        let labelTextColor = (style?["labelTextColor"] as? ColorConvertable)?.convert()
        let inputTextColor = (style?["inputTextColor"] as? ColorConvertable)?.convert()
        let errorTextColor = (style?["errorTextColor"] as? ColorConvertable)?.convert()
        let tintColor = (style?["tintColor"] as? ColorConvertable)?.convert()
        let inputFieldBackgroundColor = (style?["inputFieldBackgroundColor"] as? ColorConvertable)?.convert()
        let submitButtonColor = (style?["submitButtonColor"] as? ColorConvertable)?.convert()
        self.methodQueue.async { [weak self] in
            guard let self = self else { return }
            self.style = FormStyle.init(
                labelTextColor: labelTextColor,
                inputTextColor: inputTextColor,
                errorTextColor: errorTextColor,
                tintColor: tintColor,
                inputFieldBackgroundColor: inputFieldBackgroundColor,
                submitButtonColor: submitButtonColor)
            resolver(true)
        }
    }
}

// MARK: - CardFormViewControllerDelegate

extension PayjpCardForm: CardFormViewControllerDelegate {
    func cardFormViewController(_: CardFormViewController,
                                didCompleteWith result: CardFormResult) {
        switch result {
        case .cancel:
            self.sendEvent(withName: "onCardFormCanceled", body: nil)
            break
        case .success:
            self.sendEvent(withName: "onCardFormCompleted", body: nil)
            self.methodQueue.async {
                if let hostViewController = UIApplication.shared.keyWindow?.rootViewController {
                    if let navigationController = hostViewController as? UINavigationController {
                        navigationController.popViewController(animated: true)
                    } else {
                        hostViewController.dismiss(animated: true, completion: nil)
                    }
                }
            }
            break
        }
    }

    func cardFormViewController(_: CardFormViewController,
                                didProduced token: Token,
                                completionHandler: @escaping (Error?) -> Void) {
        self.completionHandler = completionHandler
        self.sendEvent(withName: "onCardFormProducedToken", body: token.rawValue)
    }
}
