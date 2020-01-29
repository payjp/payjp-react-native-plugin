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
#import "RNPAYCore.h"
#import <React/RCTConvert.h>
@import PAYJP;

NSString *const RNPAYErrorDomain = @"RNPAYErrorDomain";

@implementation RNPAYCore

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize
                  : (NSDictionary *)arguments resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  NSString *publicKey = arguments[@"publicKey"];
  NSAssert([publicKey isKindOfClass:[NSString class]], @"publicKey is null.");
  PAYJPSDK.publicKey = publicKey;

  NSString *localeString = arguments[@"locale"];
  if ([localeString isKindOfClass:[NSString class]]) {
    NSLocale *locale = [RCTConvert NSLocale:localeString];
    if (locale != nil) {
      PAYJPSDK.locale = locale;
    } else {
      PAYJPSDK.locale = [NSLocale currentLocale];
    }
  } else {
    PAYJPSDK.locale = [NSLocale currentLocale];
  }
  resolve([NSNull null]);
}

@end
