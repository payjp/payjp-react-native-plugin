/**
 * @format
 */

import "react-native";
import React from "react";
import App from "../src/App";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

jest.mock("payjp-react-native", () => {
    const mockPayjp = {
        PayjpCore: { init: jest.fn() },
        PayjpCardForm: { onCardFormUpdate: jest.fn(), setIOSCardFormStyle: jest.fn() },
        PayjpApplePay: { onApplePayUpdate: jest.fn() }
    };
    return mockPayjp;
});

it("renders correctly", () => {
    const app = renderer.create(<App />).toJSON();
    expect(app).toMatchSnapshot();
});
