//
//  PayjpCardForm.h
//  Pods
//
//  Created by Tadashi Wakayanagi on 2020/01/23.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <React/RCTEventEmitter.h>
@import PAYJP;

@interface PayjpCardForm : RCTEventEmitter <RCTBridgeModule, PAYCardFormViewControllerDelegate>

@end
