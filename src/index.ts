const hello = (): string => {
    return "hello react native!!";
};

export { hello };

import { NativeModules } from "react-native";

const { Payjp } = NativeModules;

export const test = async (): Promise<number | null> => {
    return await Payjp.test();
};
