//
//  PayjpCardForm.m
//  DoubleConversion
//
//  Created by Tadashi Wakayanagi on 2020/01/23.
//

#import "PayjpCardForm.h"
@import PAYJP;

@implementation PayjpCardForm

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onCardFormCanceled",
             @"onCardFormCompleted",
             @"onCardFormProducedToken"];
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(startCardForm:(NSString *)tenantId) {
    dispatch_async(dispatch_get_main_queue(), ^{
        PAYCardFormViewController *cardForm = [PAYCardFormViewController createCardFormViewControllerWithStyle:nil
                                                                                                      tenantId:tenantId];
        cardForm.delegate = self;
        UIViewController *hostViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
        if ([hostViewController isKindOfClass:[UINavigationController class]]) {
            UINavigationController *navigationController = (UINavigationController*)hostViewController;
            [navigationController pushViewController:cardForm animated:YES];
        } else {
            UINavigationController *navigationController = [UINavigationController.new initWithRootViewController:cardForm];
            navigationController.presentationController.delegate = cardForm;
            [hostViewController presentViewController:navigationController animated:YES completion:nil];
        }
    });
}

RCT_EXPORT_METHOD(completeCardForm) {
    NSLog(@"completeCardForm");
}

RCT_EXPORT_METHOD(showTokenProcessingError:(NSString *)message) {
    NSLog(@"showTokenProcessingError %@", message);
}

- (void)cardFormViewController:(PAYCardFormViewController *)_
               didCompleteWith:(enum CardFormResult)result {
    switch (result) {
      case CardFormResultCancel:
        NSLog(@"CardFormResultCancel");
        break;
      case CardFormResultSuccess:
        NSLog(@"CardFormResultSuccess");
        dispatch_async(dispatch_get_main_queue(), ^{
          UIViewController *hostViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
          if ([hostViewController isKindOfClass:[UINavigationController class]]) {
              UINavigationController *navigationController = (UINavigationController*)hostViewController;
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
             completionHandler:(void (^)(NSError * _Nullable))completionHandler {
    NSLog(@"token = %@", token);
}

@end
