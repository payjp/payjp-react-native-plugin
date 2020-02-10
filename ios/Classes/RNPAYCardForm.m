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
#import "RNPAYCardForm.h"
#import "RNPAYColorConverter.h"
#import "RNPAYCore.h"
@import PAYJP;

@interface RNPAYCardForm ()

typedef void (^CardFormCompletionHandler)(NSError *_Nullable);
@property(nonatomic, copy) CardFormCompletionHandler completionHandler;
@property(nonatomic, strong) PAYCardFormStyle *style;

@end

@implementation RNPAYCardForm

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"onCardFormCanceled", @"onCardFormCompleted", @"onCardFormProducedToken" ];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(startCardForm
                  : (NSString *)tenantId resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  NSString *description =
      [NSBundle.mainBundle objectForInfoDictionaryKey:@"NSCameraUsageDescription"];
  NSAssert([description length], @"The app's Info.plist must contain an NSCameraUsageDescription "
                                 @"key to use scanner in card form.");
  __weak typeof(self) wself = self;
  dispatch_async([self methodQueue], ^{
    PAYCardFormViewController *cardForm =
        [PAYCardFormViewController createCardFormViewControllerWithStyle:wself.style
                                                                tenantId:tenantId];
    cardForm.delegate = wself;
    UIViewController *hostViewController =
        UIApplication.sharedApplication.keyWindow.rootViewController;
    if ([hostViewController isKindOfClass:[UINavigationController class]]) {
      UINavigationController *navigationController = (UINavigationController *)hostViewController;
      [navigationController pushViewController:cardForm animated:YES];
    } else {
      UINavigationController *navigationController =
          [UINavigationController.new initWithRootViewController:cardForm];
      navigationController.presentationController.delegate = cardForm;
      [hostViewController presentViewController:navigationController animated:YES completion:nil];
    }
    resolve([NSNull null]);
  });
}

RCT_EXPORT_METHOD(completeCardForm
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  if (self.completionHandler != nil) {
    self.completionHandler(nil);
  }
  self.completionHandler = nil;
  resolve([NSNull null]);
}

RCT_EXPORT_METHOD(showTokenProcessingError
                  : (NSString *)message resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  if (self.completionHandler != nil) {
    NSDictionary *info = @{NSLocalizedDescriptionKey : message};
    NSError *error = [NSError errorWithDomain:RNPAYErrorDomain code:0 userInfo:info];
    self.completionHandler(error);
  }
  self.completionHandler = nil;
  resolve([NSNull null]);
}

RCT_EXPORT_METHOD(setStyle
                  : (NSDictionary *)style setThemeWithResolver
                  : (RCTPromiseResolveBlock)resolve rejecter
                  : (RCTPromiseRejectBlock)reject) {
  dispatch_async([self methodQueue], ^{
    UIColor *labelTextColor = nil;
    UIColor *inputTextColor = nil;
    UIColor *tintColor = nil;
    UIColor *inputFieldBackgroundColor = nil;
    UIColor *submitButtonColor = nil;

    if (style[@"labelTextColor"]) {
      labelTextColor = [RNPAYColorConverter fromJsonDictionary:style[@"labelTextColor"]];
    }
    if (style[@"inputTextColor"]) {
      inputTextColor = [RNPAYColorConverter fromJsonDictionary:style[@"inputTextColor"]];
    }
    if (style[@"tintColor"]) {
      tintColor = [RNPAYColorConverter fromJsonDictionary:style[@"tintColor"]];
    }
    if (style[@"inputFieldBackgroundColor"]) {
      inputFieldBackgroundColor =
          [RNPAYColorConverter fromJsonDictionary:style[@"inputFieldBackgroundColor"]];
    }
    if (style[@"submitButtonColor"]) {
      submitButtonColor = [RNPAYColorConverter fromJsonDictionary:style[@"submitButtonColor"]];
    }

    self.style = [[PAYCardFormStyle alloc] initWithLabelTextColor:labelTextColor
                                                   inputTextColor:inputTextColor
                                                        tintColor:tintColor
                                        inputFieldBackgroundColor:inputFieldBackgroundColor
                                                submitButtonColor:submitButtonColor];

    resolve([NSNull null]);
  });
}

- (void)cardFormViewController:(PAYCardFormViewController *)_
               didCompleteWith:(enum CardFormResult)result {
  switch (result) {
    case CardFormResultCancel:
      [self sendEventWithName:@"onCardFormCanceled" body:nil];
      break;
    case CardFormResultSuccess:
      [self sendEventWithName:@"onCardFormCompleted" body:nil];
      dispatch_async([self methodQueue], ^{
        UIViewController *hostViewController =
            UIApplication.sharedApplication.keyWindow.rootViewController;
        if ([hostViewController isKindOfClass:[UINavigationController class]]) {
          UINavigationController *navigationController =
              (UINavigationController *)hostViewController;
          [navigationController popViewControllerAnimated:YES];
        } else {
          [hostViewController dismissViewControllerAnimated:YES completion:nil];
        }
      });
      break;
  }
}

- (void)cardFormViewController:(PAYCardFormViewController *)_
                   didProduced:(PAYToken *)token
             completionHandler:(void (^)(NSError *_Nullable))completionHandler {
  self.completionHandler = completionHandler;
  [self sendEventWithName:@"onCardFormProducedToken" body:token.rawValue];
}

@end
