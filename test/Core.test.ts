import * as PayjpCore from "../src/Core";
import { NativeModules } from "react-native";

jest.mock("react-native", () => ({
    NativeModules: {
        Payjp: { initialize: jest.fn() }
    }
}));

describe("Test", () => {
    it("initialize", async done => {
        expect.assertions(2);
        const option = {
            publicKey: "pk_test_123",
            locale: "ja",
            debugEnabled: true
        };
        try {
            await PayjpCore.init(option);
            expect(NativeModules.Payjp.initialize).toHaveBeenCalledTimes(1);
            expect(NativeModules.Payjp.initialize).toHaveBeenCalledWith(option);
            done();
        } catch (e) {
            console.error(e);
        }
    });
});
