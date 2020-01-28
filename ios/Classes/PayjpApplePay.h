//
//  PayjpApplePay.h
//  RNPayjp
//
//  Created by Tatsuya Kitagawa on 2020/01/27.
//  Copyright © 2020 PAY.JP. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@import PAYJP;
@import PassKit;

@interface PayjpApplePay
    : RCTEventEmitter <RCTBridgeModule, PKPaymentAuthorizationViewControllerDelegate>

@end
