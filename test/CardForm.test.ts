// LICENSE : MIT
import * as PayjpCardForm from '../src/CardForm';
import { CardFormType } from './../src/CardForm';
import { NativeModules } from 'react-native';

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
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
            RNPAYCardForm: {
                startCardForm: jest.fn(),
                completeCardForm: jest.fn(),
                showTokenProcessingError: jest.fn(),
                setFormStyle: jest.fn(),
            },
        },
        // setIOSCardFormStyle call `processColor` internal.
        processColor: RN.processColor,
    };
    return mockReactNative;
});

describe('PayjpCardForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('startCardForm', async () => {
        expect.assertions(1);
        try {
            await PayjpCardForm.startCardForm();
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });

    it('startCardForm with tenantId', async () => {
        expect.assertions(2);
        const tenantId = 'ten_123';
        try {
            await PayjpCardForm.startCardForm({ tenantId: tenantId });
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledWith(
                tenantId,
                undefined,
                true,
                true,
                undefined,
                undefined,
                undefined,
            );
        } catch (e) {
            console.error(e);
        }
    });

    it('startCardForm with cardFormType', async () => {
        expect.assertions(2);
        const formType: CardFormType = 'cardDisplay';
        try {
            await PayjpCardForm.startCardForm({ cardFormType: formType });
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledWith(
                undefined,
                formType,
                true,
                true,
                undefined,
                undefined,
                undefined,
            );
        } catch (e) {
            console.error(e);
        }
    });

    it('startCardForm with extraAttribute: email', async () => {
        expect.assertions(2);
        try {
            await PayjpCardForm.startCardForm({ extraAttributes: [{ type: 'email' }] });
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledWith(
                undefined,
                undefined,
                true,
                false,
                undefined,
                undefined,
                undefined,
            );
        } catch (e) {
            console.error(e);
        }
    });

    it('startCardForm with extraAttribute: phone', async () => {
        expect.assertions(2);
        try {
            await PayjpCardForm.startCardForm({ extraAttributes: [{ type: 'phone' }] });
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledWith(
                undefined,
                undefined,
                false,
                true,
                undefined,
                undefined,
                undefined,
            );
        } catch (e) {
            console.error(e);
        }
    });

    it('startCardForm with extraAttribute: preset email and phone', async () => {
        expect.assertions(2);
        try {
            await PayjpCardForm.startCardForm({
                extraAttributes: [
                    { type: 'email', preset: 'test@example.com' },
                    { type: 'phone', presetRegion: 'JP', presetNumber: '09012345678' },
                ],
            });
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.startCardForm).toHaveBeenCalledWith(
                undefined,
                undefined,
                true,
                true,
                'test@example.com',
                'JP',
                '09012345678',
            );
        } catch (e) {
            console.error(e);
        }
    });

    it('completeCardForm', async () => {
        expect.assertions(1);
        try {
            await PayjpCardForm.completeCardForm();
            expect(NativeModules.RNPAYCardForm.completeCardForm).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });

    it('showTokenProcessingError', async () => {
        expect.assertions(2);
        const message = 'test';
        try {
            await PayjpCardForm.showTokenProcessingError(message);
            expect(NativeModules.RNPAYCardForm.showTokenProcessingError).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.showTokenProcessingError).toHaveBeenCalledWith(message);
        } catch (e) {
            console.error(e);
        }
    });

    it('listen onCardFormCanceled', async () => {
        expect.assertions(1);
        try {
            const onCardFormCanceled = jest.fn();
            PayjpCardForm.onCardFormUpdate({
                onCardFormCanceled,
                onCardFormCompleted: jest.fn(),
                onCardFormProducedToken: jest.fn(),
            });
            NativeModules.MockEventEmitter.listeners.onCardFormCanceled();
            expect(onCardFormCanceled).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });

    it('listen onCardFormCompleted', async () => {
        expect.assertions(1);
        try {
            const onCardFormCompleted = jest.fn();
            PayjpCardForm.onCardFormUpdate({
                onCardFormCanceled: jest.fn(),
                onCardFormCompleted,
                onCardFormProducedToken: jest.fn(),
            });
            NativeModules.MockEventEmitter.listeners.onCardFormCompleted();
            expect(onCardFormCompleted).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });

    it('listen onCardFormCompleted with onCardFormProducedToken', async () => {
        expect.assertions(2);
        try {
            const token = { id: 'tok_123' };
            const onCardFormProducedToken = jest.fn();
            PayjpCardForm.onCardFormUpdate({
                onCardFormCanceled: jest.fn(),
                onCardFormCompleted: jest.fn(),
                onCardFormProducedToken,
            });
            NativeModules.MockEventEmitter.listeners.onCardFormProducedToken(token);
            expect(onCardFormProducedToken).toHaveBeenCalledTimes(1);
            expect(onCardFormProducedToken).toHaveBeenCalledWith(token);
        } catch (e) {
            console.error(e);
        }
    });

    it('unsubscribe listener', async () => {
        expect.assertions(3);
        try {
            const unsubscribe = PayjpCardForm.onCardFormUpdate({
                onCardFormCanceled: jest.fn(),
                onCardFormCompleted: jest.fn(),
                onCardFormProducedToken: jest.fn(),
            });
            unsubscribe();
            const removers = NativeModules.MockEventEmitter.removers;
            expect(removers.onCardFormCanceled.remove).toHaveBeenCalledTimes(1);
            expect(removers.onCardFormCompleted.remove).toHaveBeenCalledTimes(1);
            expect(removers.onCardFormProducedToken.remove).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.error(e);
        }
    });

    it('setIOSCardFormStyle', async () => {
        expect.assertions(2);
        const style: PayjpCardForm.IOSCardFormStyle = {
            labelTextColor: 'rgba(255, 0, 255, 1.0)',
            inputTextColor: '#004488',
            submitButtonColor: 'hsl(360, 100%, 100%)',
        };
        const converted = {
            labelTextColor: 4294902015,
            inputTextColor: 4278207624,
            submitButtonColor: 4294967295,
        };
        try {
            await PayjpCardForm.setIOSCardFormStyle(style);
            expect(NativeModules.RNPAYCardForm.setFormStyle).toHaveBeenCalledTimes(1);
            expect(NativeModules.RNPAYCardForm.setFormStyle).toHaveBeenCalledWith(converted);
        } catch (e) {
            console.error(e);
        }
    });
});
