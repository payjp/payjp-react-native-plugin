
#import "Payjp.h"
@import PAYJP;

@implementation Payjp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize:(NSDictionary *)arguments) {
  PAYJPSDK.publicKey = [arguments valueForKey:@"publicKey"];
  NSString *localeString = [arguments valueForKey:@"locale"];
  if (localeString != nil) {
      PAYJPSDK.locale = [NSLocale localeWithLocaleIdentifier:localeString];
  } else {
      PAYJPSDK.locale = [NSLocale currentLocale];
  }
}

@end
