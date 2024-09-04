/* eslint-disable no-undef */
describe('Example', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });
    it('should show card form screen after add credit card tap', async () => {
        await element(by.id('start_card_form')).tap();
        await element(by.text('email and phone')).tap();
        if (device.getPlatform() === 'ios') {
            await expect(element(by.text('Expiration date'))).toBeVisible();
            await expect(element(by.text('Security code'))).toBeVisible();
            await expect(element(by.text('Name'))).toBeVisible();
            await expect(element(by.text('Email'))).toBeVisible();
            await expect(element(by.text('Phone Number'))).toBeVisible();
            await expect(element(by.text('submit'))).toBeVisible();
            // close
            await element(by.text('Cancel')).tap();
            await expect(element(by.id('start_card_form'))).toBeVisible();
        } else {
            // Android cannot find element by text,
            // because they have input fields without labels.
            await expect(element(by.text('SUBMIT'))).toBeVisible(1);
            await device.pressBack();
            await expect(element(by.id('start_card_form'))).toBeVisible();
        }
    });
});
