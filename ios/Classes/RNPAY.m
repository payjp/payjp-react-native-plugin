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
#import "RNPAY.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NSString *const RNPAYErrorDomain = @"RNPAYErrorDomain";
NSString *const RNPAYPluginVersion = @"0.2.3";

@interface RCT_EXTERN_MODULE (RNPAYCore, NSObject)

RCT_EXTERN_METHOD(initialize
                  : (NSDictionary *)arguments resolver
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

@end

@interface RCT_EXTERN_MODULE (RNPAYCardForm, RCTEventEmitter)

RCT_EXTERN_METHOD(startCardForm
                  : (NSString *)tenantId resolver
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(completeCardForm
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(showTokenProcessingError
                  : (NSString *)message resolver
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setFormStyle
                  : (NSDictionary *)style resolver
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

@end

@interface RCT_EXTERN_MODULE (RNPAYApplePay, RCTEventEmitter)

RCT_EXTERN_METHOD(isApplePayAvailable
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(makeApplePayToken
                  : (NSDictionary *)arguments resolver
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(completeApplePay
                  : (BOOL)isSuccess errorMessage
                  : (NSString *)errorMessage resolver
                  : (nonnull RCTPromiseResolveBlock)resolver rejecter
                  : (nonnull RCTPromiseRejectBlock)rejecter)

@end
