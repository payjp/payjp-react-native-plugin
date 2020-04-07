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

@objc(RNPAYCore)
class PayjpCore: NSObject {}

// MARK: - Bridiging API

@objc extension PayjpCore {

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    var methodQueue: DispatchQueue {
        return DispatchQueue.main
    }

    func initialize(
        _ arguments: [String: Any]?,
        resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) {
        guard let publicKey = arguments?["publicKey"] as? String else {
            let noPublicKeyMessage = "publicKey is required"
            assertionFailure(noPublicKeyMessage)
            let error = NSError.init(domain: RNPAYErrorDomain,
                                     code: 0,
                                     userInfo: [NSLocalizedDescriptionKey: noPublicKeyMessage])
            rejecter("error", noPublicKeyMessage, error)
            return
        }
        PAYJPSDK.publicKey = publicKey
        if let localeString = arguments?["locale"] as? String {
            PAYJPSDK.locale = Locale.init(identifier: localeString)
        } else {
            PAYJPSDK.locale = Locale.current
        }
        let plugin = "jp.pay.reactnative/\(RNPAYPluginVersion)"
        PAYJPSDK.clientInfo = ClientInfo.makeInfo(plugin: plugin, publisher: "payjp")
        resolver(true)
    }
}
