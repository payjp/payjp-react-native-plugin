// LICENSE : MIT
import * as PayjpCore from "../src/Core";
import { NativeModules } from "react-native";

jest.mock("react-native", () => ({
    NativeModules: {
        RNPAYCore: { initialize: jest.fn() },
    },
}));

describe("PayjpCore", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("initialize", async (done) => {
        expect.assertions(2);
        const option = {
            publicKey: "pk_test_123",
            locale: "ja",
            debugEnabled: true,
        };
        try {
            await PayjpCore.init(option);
            expect(NativeModules.RNPAYCore.initialize).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCore.initialize).toHaveBeenCalledWith(option);
            done();
        } catch (e) {
            console.error(e);
        }
    });

    it("initialize with default args", async (done) => {
        expect.assertions(2);
        const publicKey = "pk_test_123";
        try {
            await PayjpCore.init({
                publicKey,
            });
            expect(NativeModules.RNPAYCore.initialize).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCore.initialize).toHaveBeenCalledWith({
                publicKey,
                locale: null,
                debugEnabled: false,
            });
            done();
        } catch (e) {
            console.error(e);
        }
    });
});
