
#import "RNPayjp.h"
@import PAYJP

@implementation RNPayjp

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize) {
  PAYJPSDK.publicKey = PAYJPPublicKey;
  PAYJPSDK.locale = [NSLocale currentLocale];
  NSLog(@"initialize method called.");
}

@end
