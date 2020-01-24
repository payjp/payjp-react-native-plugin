
#import "Payjp.h"
@import PAYJP;

@implementation Payjp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize:(NSDictionary *)arguments) {
    NSString *publicKey = [arguments valueForKey:@"publicKey"];
    NSAssert(publicKey != nil, @"publicKey is nil.");
    PAYJPSDK.publicKey = [arguments valueForKey:@"publicKey"];
    
    NSObject *locale = [arguments valueForKey:@"locale"];
    if (locale != [NSNull null] && locale != nil) {
        NSString *localeString = (NSString*)locale;
        PAYJPSDK.locale = [NSLocale localeWithLocaleIdentifier:localeString];
    } else {
        PAYJPSDK.locale = [NSLocale currentLocale];
    }
}

@end
