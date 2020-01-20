const hello = (): string => {
    return "hello react native!!";
};

export { hello };

import { NativeModules, Platform } from "react-native";

const { NativePayjpModules } = NativeModules;

const getOSVersion = async (): Promise<number | null> => {
    return await NativePayjpModules.getOSVersion();
};

export const doStuff = Platform.select({
    ios: {},
    android: {
        getOSVersion
    }
});
