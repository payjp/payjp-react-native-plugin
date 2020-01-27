
#import "Payjp.h"
#import <React/RCTConvert.h>
@import PAYJP;

NSString *const RNPAYErrorDomain = @"RNPAYErrorDomain";

@implementation Payjp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize:(NSDictionary *)arguments
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(__unused RCTPromiseRejectBlock)reject) {
    NSString *publicKey = arguments[@"publicKey"];
    NSAssert([publicKey isKindOfClass:[NSString class]], @"publicKey is null.");
    PAYJPSDK.publicKey = publicKey;
    
    NSString *localeString = arguments[@"locale"];
    if ([localeString isKindOfClass:[NSString class]]) {
        NSLocale *locale = [RCTConvert NSLocale:localeString];
        if (locale != nil) {
            PAYJPSDK.locale = locale;
        } else {
            PAYJPSDK.locale = [NSLocale currentLocale];
        }
    } else {
        PAYJPSDK.locale = [NSLocale currentLocale];
    }
    resolve([NSNull null]);
}

@end
