//
//  PayjpCardForm.m
//  DoubleConversion
//
//  Created by Tadashi Wakayanagi on 2020/01/23.
//

#import "PayjpCardForm.h"
#import "Payjp.h"
@import PAYJP;

@interface PayjpCardForm ()

typedef void (^CardFormCompletionHandler)(NSError *_Nullable);
@property(nonatomic, copy) CardFormCompletionHandler completionHandler;

@end

@implementation PayjpCardForm

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
  NSString *description = [NSBundle.mainBundle objectForInfoDictionaryKey:@"NSCameraUsageDescription"];
  NSAssert([description length], @"The app's Info.plist must contain an NSCameraUsageDescription key to use scanner in card form.");
  dispatch_async([self methodQueue], ^{
    PAYCardFormViewController *cardForm =
        [PAYCardFormViewController createCardFormViewControllerWithStyle:nil tenantId:tenantId];
    cardForm.delegate = self;
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
