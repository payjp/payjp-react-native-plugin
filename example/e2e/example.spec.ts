import { expect, device, element, by } from "detox";

describe("Example", () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it("should show card form screen after add credit card tap", async () => {
        await element(by.id("start_card_form")).tap();
        await expect(element(by.text("Expiration date"))).toBeVisible();
        await expect(element(by.text("Security code"))).toBeVisible();
        await expect(element(by.text("Name"))).toBeVisible();
    });
});
