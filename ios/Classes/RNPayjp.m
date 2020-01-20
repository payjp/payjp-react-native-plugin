
#import "RNPayjp.h"
@import PAYJP;

NSString *const PAYJPPublicKey = @"pk_test_0383a1b8f91e8a6e3ea0e2a9";

@implementation RNPayjp

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize) {
  PAYJPSDK.publicKey = PAYJPPublicKey;
  PAYJPSDK.locale = [NSLocale currentLocale];
}

@end
