
#import "Payjp.h"
#import <React/RCTConvert.h>
@import PAYJP;

@implementation Payjp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize:(NSDictionary *)arguments) {
    NSString *publicKey = arguments[@"publicKey"];
    NSAssert(![publicKey isKindOfClass:[NSNull class]], @"publicKey is null.");
    PAYJPSDK.publicKey = publicKey;
    
    NSString *localeString = arguments[@"locale"];
    if (![localeString isKindOfClass:[NSNull class]]) {
        NSLocale *locale = [RCTConvert NSLocale:localeString];
        if (locale != nil) {
            PAYJPSDK.locale = locale;
        } else {
            PAYJPSDK.locale = [NSLocale currentLocale];
        }
    } else {
        PAYJPSDK.locale = [NSLocale currentLocale];
    }
}

@end
