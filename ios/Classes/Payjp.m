
#import "Payjp.h"
@import PAYJP;

@implementation Payjp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initialize:(NSDictionary *)arguments) {
    NSString *publicKey = [arguments valueForKey:@"publicKey"];
    NSLog(@"publicKey %@", publicKey);
    NSAssert(publicKey != nil, @"publicKey is nil.");
    PAYJPSDK.publicKey = [arguments valueForKey:@"publicKey"];
    
    NSString *localeString = [arguments valueForKey:@"locale"];
    NSLog(@"localeString %@", localeString);
    if (localeString != nil) {
        PAYJPSDK.locale = [NSLocale localeWithLocaleIdentifier:localeString];
    } else {
        PAYJPSDK.locale = [NSLocale currentLocale];
    }
}

@end
