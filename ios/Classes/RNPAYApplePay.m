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
#import "RNPAYApplePay.h"
#import "RNPAY.h"
@import PAYJP;

@interface RNPAYApplePay ()

@property(nonatomic, copy) id completionHandler;

@end

@implementation RNPAYApplePay

#pragma mark - Module Setting

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"onApplePayProducedToken", @"onApplePayFailedRequestToken", @"onApplePayCompleted" ];
}

#pragma mark - isApplePayAvailable

RCT_EXPORT_METHOD(isApplePayAvailable
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  dispatch_async([self methodQueue], ^{
    resolve(@([PKPaymentAuthorizationViewController canMakePayments]));
  });
}

#pragma mark - makeApplePayToken

RCT_EXPORT_METHOD(makeApplePayToken
                  : (NSDictionary *)arguments resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  NSAssert([arguments[@"appleMerchantId"] isKindOfClass:[NSString class]],
           @"invalid appleMerchantId");
  PKPaymentRequest *request = [[PKPaymentRequest alloc] init];
  request.merchantIdentifier = arguments[@"appleMerchantId"];
  request.currencyCode = arguments[@"currencyCode"];
  request.countryCode = arguments[@"countryCode"];
  NSDecimalNumber *amount =
      [NSDecimalNumber decimalNumberWithString:arguments[@"summaryItemAmount"]];
  PKPaymentSummaryItem *summaryItem =
      [PKPaymentSummaryItem summaryItemWithLabel:arguments[@"summaryItemLabel"] amount:amount];
  request.paymentSummaryItems = @[ summaryItem ];
  request.supportedNetworks = [self supportedPaymentNetworks];
  request.merchantCapabilities = PKMerchantCapability3DS;
  if ([arguments[@"requiredBillingAddress"] boolValue]) {
    request.requiredBillingAddressFields = PKAddressFieldPostalAddress;
  }
  dispatch_async([self methodQueue], ^{
    PKPaymentAuthorizationViewController *viewController =
        [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:request];
    viewController.delegate = self;
    UIViewController *rootViewController =
        UIApplication.sharedApplication.keyWindow.rootViewController;
    [rootViewController presentViewController:viewController animated:YES completion:nil];
    resolve([NSNull null]);
  });
}

#pragma mark - completeApplePay

RCT_EXPORT_METHOD(completeApplePay
                  : (BOOL)isSuccess errorMessage
                  : (NSString *__nullable)errorMessage resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  __weak typeof(self) wself = self;
  dispatch_async([self methodQueue], ^{
    if (@available(iOS 11.0, *)) {
      void (^completion)(PKPaymentAuthorizationResult *) = wself.completionHandler;
      if (!completion) {
        resolve([NSNull null]);
        return;
      }
      if (isSuccess) {
        completion([[PKPaymentAuthorizationResult alloc]
            initWithStatus:PKPaymentAuthorizationStatusSuccess
                    errors:nil]);
      } else {
        NSDictionary *userInfo = errorMessage != nil && errorMessage.length > 0
                                     ? @{NSLocalizedDescriptionKey : errorMessage}
                                     : nil;
        NSError *error = [NSError errorWithDomain:RNPAYErrorDomain code:0 userInfo:userInfo];
        completion([[PKPaymentAuthorizationResult alloc]
            initWithStatus:PKPaymentAuthorizationStatusFailure
                    errors:@[ error ]]);
      }
    } else {
      void (^completion)(PKPaymentAuthorizationStatus) = wself.completionHandler;
      if (!completion) {
        resolve([NSNull null]);
        return;
      }
      if (isSuccess) {
        completion(PKPaymentAuthorizationStatusSuccess);
      } else {
        completion(PKPaymentAuthorizationStatusFailure);
      }
    }
    wself.completionHandler = nil;
    resolve([NSNull null]);
  });
}

#pragma mark - Tokenize

- (void)createTokenWithPaymentToken:(PKPaymentToken *)paymentToken {
  __weak typeof(self) wself = self;
  [PAYAPIClient.sharedClient
        createTokenWith:paymentToken
      completionHandler:^(PAYToken *token, NSError *error) {
        if (token) {
          [wself sendEventWithName:@"onApplePayProducedToken" body:token.rawValue];
        } else {
          NSDictionary *errorInfo = @{
            @"errorType" : @"applepay",
            @"errorCode" : @(error.code),
            @"errorMessage" : error.localizedDescription,
          };
          [wself sendEventWithName:@"onApplePayFailedRequestToken" body:errorInfo];
        }
      }];
}

#pragma mark - Utilities

- (NSArray<PKPaymentNetwork> *)supportedPaymentNetworks {
  if (@available(iOS 10.0, *)) {
    return [PKPaymentRequest availableNetworks];
  } else {
    return @[
      PKPaymentNetworkVisa, PKPaymentNetworkMasterCard, PKPaymentNetworkAmex,
      PKPaymentNetworkDiscover
    ];
  }
}

#pragma mark - PKPaymentAuthorizationViewControllerDelegate

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion {
  if (@available(iOS 11.0, *)) {
    // do nothing
  } else {
    self.completionHandler = completion;
    [self createTokenWithPaymentToken:payment.token];
  }
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                   handler:
                                       (void (^)(PKPaymentAuthorizationResult *__nonnull))completion
    API_AVAILABLE(ios(11.0)) {
  self.completionHandler = completion;
  [self createTokenWithPaymentToken:payment.token];
}

- (void)paymentAuthorizationViewControllerDidFinish:
    (PKPaymentAuthorizationViewController *)controller {
  UIViewController *rootViewController =
      UIApplication.sharedApplication.keyWindow.rootViewController;
  if ([rootViewController isKindOfClass:[UINavigationController class]]) {
    [rootViewController.navigationController popViewControllerAnimated:YES];
  } else {
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
  }
  [self sendEventWithName:@"onApplePayCompleted" body:nil];
}

@end
