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
#import "RNPAY.h"
#import "RNPAYColorConverter.h"
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
                  : (NSString *)tenantId cardFormViewType
                  : (NSString *)cardFormViewType resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  NSString *description =
      [NSBundle.mainBundle objectForInfoDictionaryKey:@"NSCameraUsageDescription"];
  NSAssert([description length], @"The app's Info.plist must contain an NSCameraUsageDescription "
                                 @"key to use scanner in card form.");
  __weak typeof(self) wself = self;

  CardFormViewType viewType = CardFormViewTypeLabelStyled;
  if ([cardFormViewType isEqual:@"multiLine"]) {
    viewType = CardFormViewTypeLabelStyled;
  } else if ([cardFormViewType isEqual:@"cardDisplay"]) {
    viewType = CardFormViewTypeDisplayStyled;
  } else if ([cardFormViewType isEqual:@"tableStyled"]) {
    viewType = CardFormViewTypeTableStyled;
  }

  dispatch_async([self methodQueue], ^{
    PAYCardFormViewController *cardForm = [PAYCardFormViewController
        createCardFormViewControllerWithStyle:wself.style ?: PAYCardFormStyle.defaultStyle
                                     tenantId:tenantId
                                     delegate:wself
                                     viewType:viewType];
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

RCT_EXPORT_METHOD(setFormStyle
                  : (NSDictionary *)style resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (__unused RCTPromiseRejectBlock)reject) {
  __weak typeof(self) wself = self;
  dispatch_async([self methodQueue], ^{
    UIColor *labelTextColor = nil;
    UIColor *inputTextColor = nil;
    UIColor *errorTextColor = nil;
    UIColor *tintColor = nil;
    UIColor *inputFieldBackgroundColor = nil;
    UIColor *submitButtonColor = nil;
    UIColor *highlightColor = nil;

    if (style[@"labelTextColor"]) {
      labelTextColor = [RNPAYColorConverter fromJson:style[@"labelTextColor"]];
    }
    if (style[@"inputTextColor"]) {
      inputTextColor = [RNPAYColorConverter fromJson:style[@"inputTextColor"]];
    }
    if (style[@"errorTextColor"]) {
      errorTextColor = [RNPAYColorConverter fromJson:style[@"errorTextColor"]];
    }
    if (style[@"tintColor"]) {
      tintColor = [RNPAYColorConverter fromJson:style[@"tintColor"]];
    }
    if (style[@"inputFieldBackgroundColor"]) {
      inputFieldBackgroundColor =
          [RNPAYColorConverter fromJson:style[@"inputFieldBackgroundColor"]];
    }
    if (style[@"submitButtonColor"]) {
      submitButtonColor = [RNPAYColorConverter fromJson:style[@"submitButtonColor"]];
    }
    if (style[@"highlightColor"]) {
      highlightColor = [RNPAYColorConverter fromJson:style[@"highlightColor"]];
    }

    wself.style = [[PAYCardFormStyle alloc] initWithLabelTextColor:labelTextColor
                                                    inputTextColor:inputTextColor
                                                    errorTextColor:errorTextColor
                                                         tintColor:tintColor
                                         inputFieldBackgroundColor:inputFieldBackgroundColor
                                                 submitButtonColor:submitButtonColor
                                                    highlightColor:highlightColor];

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
