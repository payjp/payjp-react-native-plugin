const hello = (): string => {
    return "hello react native!!";
};

export { hello };

import { NativeModules } from "react-native";

const { RNPayjpLibrary } = NativeModules;

export { RNPayjpLibrary };
