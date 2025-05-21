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
#import "RNPAYThreeDSecureProcessHandler.h"
@import PAYJP;

@interface RNPAYThreeDSecureProcessHandler () <PAYJPThreeDSecureProcessHandlerDelegate>

@property(nonatomic, strong) RCTPromiseResolveBlock pendingResolve;
@property(nonatomic, strong) RCTPromiseRejectBlock pendingReject;

@end

@implementation RNPAYThreeDSecureProcessHandler

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(startThreeDSecureProcess : (NSString *)resourceId resolve : (
    RCTPromiseResolveBlock)resolve reject : (RCTPromiseRejectBlock)reject) {
  if (self.pendingResolve != nil || self.pendingReject != nil) {
    reject(@"PENDING_OPERATION", @"Another 3DS process is already in progress.", nil);
    return;
  }

  self.pendingResolve = resolve;
  self.pendingReject = reject;

  __weak typeof(self) wself = self;
  dispatch_async([self methodQueue], ^{
    PAYJPThreeDSecureProcessHandler *handler = [PAYJPThreeDSecureProcessHandler sharedHandler];

    UIViewController *hostViewController =
        UIApplication.sharedApplication.keyWindow.rootViewController;
    while (hostViewController.presentedViewController) {
      hostViewController = hostViewController.presentedViewController;
    }
    if ([hostViewController isKindOfClass:[UINavigationController class]]) {
      UINavigationController *navigationController = (UINavigationController *)hostViewController;
      hostViewController = navigationController.visibleViewController;
    }

    [handler startThreeDSecureProcessWithViewController:hostViewController
                                               delegate:wself
                                             resourceId:resourceId];
  });
}

#pragma mark - ThreeDSecureProcessHandlerDelegate

- (void)threeDSecureProcessHandlerDidFinish:(PAYJPThreeDSecureProcessHandler *)handler
                                     status:(ThreeDSecureProcessStatus)status {
  if (self.pendingResolve == nil && self.pendingReject == nil) {
    return;
  }

  switch (status) {
    case ThreeDSecureProcessStatusCompleted:
      if (self.pendingResolve) {
        self.pendingResolve(@{@"status" : @"completed"});
      }
      break;
    case ThreeDSecureProcessStatusCanceled:
      if (self.pendingResolve) {
        self.pendingResolve(@{@"status" : @"canceled"});
      }
      break;
    default:
      if (self.pendingReject) {
        self.pendingReject(@"THREE_D_SECURE_FAILED",
                           @"ThreeDSecure process failed with unknown status.", nil);
      }
      break;
  }

  self.pendingResolve = nil;
  self.pendingReject = nil;
}

@end
