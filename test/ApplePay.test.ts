// LICENSE : MIT
import * as PayjpApplePay from '../src/ApplePay';
import { NativeModules } from 'react-native';

jest.mock('react-native', () => {
    const emitter = {
        listeners: {} as any,

        removers: {} as any,
        addListener: jest.fn((eventName, callback) => {
            emitter.listeners[eventName] = callback;
            const remover = {
                remove: jest.fn(),
            };
            emitter.removers[eventName] = remover;
            return remover;
        }),
    };
    const mockReactNative = {
        NativeEventEmitter: jest.fn(() => emitter),
        NativeModules: {
            MockEventEmitter: emitter,
            RNPAYApplePay: {
                isApplePayAvailable: jest.fn(() => true),
                makeApplePayToken: jest.fn(),
                completeApplePay: jest.fn(),
            },
        },
    };
    return mockReactNative;
});

describe('PayjpApplePay', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('isApplePayAvailable', async () => {
        expect.assertions(2);
        try {
            const isAvailable = await PayjpApplePay.isApplePayAvailable();
            expect(NativeModules.RNPAYApplePay.isApplePayAvailable).toHaveBeenCalledTimes(1);
            expect(isAvailable).toBe(true);
        } catch (e) {
            console.error(e);
        }
    });

    it('makeApplePayToken', async () => {
        expect.assertions(2);
        try {
            const request = {
                appleMerchantId: 'merchant.com.example',
                currencyCode: 'JPY',
                countryCode: 'JP',
                summaryItemLabel: 'PAY.JP T-shirt',
                summaryItemAmount: '100',
                requiredBillingAddress: true,
            };
            await PayjpApplePay.makeApplePayToken(request);
            expect(NativeModules.RNPAYApplePay.makeApplePayToken).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYApplePay.makeApplePayToken).toHaveBeenCalledWith(request);
        } catch (e) {
            console.error(e);
        }
    });

    it('completeApplePay with success params', async () => {
        expect.assertions(2);
        try {
            await PayjpApplePay.completeApplePay(true);
            expect(NativeModules.RNPAYApplePay.completeApplePay).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYApplePay.completeApplePay).toHaveBeenCalledWith(true, null);
        } catch (e) {
            console.error(e);
        }
    });

    it('completeApplePay with failure params', async () => {
        expect.assertions(2);
        try {
            const message = 'test';
            await PayjpApplePay.completeApplePay(false, message);
            expect(NativeModules.RNPAYApplePay.completeApplePay).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYApplePay.completeApplePay).toHaveBeenCalledWith(false, message);
        } catch (e) {
            console.error(e);
        }
    });

    it('listen onApplePayCompleted', async () => {
        expect.assertions(1);
        try {
            const onApplePayCompleted = jest.fn();
            PayjpApplePay.onApplePayUpdate({
                onApplePayCompleted,
                onApplePayFailedRequestToken: jest.fn(),
                onApplePayProducedToken: jest.fn(),
            });
            NativeModules.MockEventEmitter.listeners.onApplePayCompleted();
            expect(onApplePayCompleted).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });

    it('listen onApplePayFailedRequestToken', async () => {
        expect.assertions(2);
        try {
            const onApplePayFailedRequestToken = jest.fn();
            const errorInfo = {};
            PayjpApplePay.onApplePayUpdate({
                onApplePayCompleted: jest.fn(),
                onApplePayFailedRequestToken,
                onApplePayProducedToken: jest.fn(),
            });
            NativeModules.MockEventEmitter.listeners.onApplePayFailedRequestToken(errorInfo);
            expect(onApplePayFailedRequestToken).toHaveBeenCalledTimes(1);
            expect(onApplePayFailedRequestToken).toHaveBeenCalledWith(errorInfo);
        } catch (e) {
            console.error(e);
        }
    });

    it('listen onApplePayProducedToken', async () => {
        expect.assertions(2);
        try {
            const onApplePayProducedToken = jest.fn();
            const token = { id: 'tok_123' };
            PayjpApplePay.onApplePayUpdate({
                onApplePayCompleted: jest.fn(),
                onApplePayFailedRequestToken: jest.fn(),
                onApplePayProducedToken,
            });
            NativeModules.MockEventEmitter.listeners.onApplePayProducedToken(token);
            expect(onApplePayProducedToken).toHaveBeenCalledTimes(1);
            expect(onApplePayProducedToken).toHaveBeenCalledWith(token);
        } catch (e) {
            console.error(e);
        }
    });

    it('unsubscribe listener', async () => {
        expect.assertions(3);
        try {
            const unsubscribe = PayjpApplePay.onApplePayUpdate({
                onApplePayCompleted: jest.fn(),
                onApplePayFailedRequestToken: jest.fn(),
                onApplePayProducedToken: jest.fn(),
            });
            unsubscribe();
            const removers = NativeModules.MockEventEmitter.removers;
            expect(removers.onApplePayCompleted.remove).toHaveBeenCalledTimes(1);
            expect(removers.onApplePayFailedRequestToken.remove).toHaveBeenCalledTimes(1);
            expect(removers.onApplePayProducedToken.remove).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });
});
