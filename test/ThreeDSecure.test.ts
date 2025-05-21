// LICENSE : MIT
import type * as PayjpThreeDSecureType from '../src/ThreeDSecure';

let currentMockEmitterInstance: {
    listeners: Record<string, (...args: any[]) => void>;
    removers: Record<string, { remove: jest.Mock }>;
    addListener: jest.Mock;
    _simulateEvent: jest.Mock;
    _getRemoveMockForEvent: jest.Mock;
} | null = null;

const mockRNPAYThreeDSecureProcessHandler = {
    startThreeDSecureProcess: jest.fn(),
};

jest.mock('react-native', () => {
    const NativeEventEmitterMock = jest.fn().mockImplementation(() => {
        const instance = {
            listeners: {} as Record<string, (...args: any[]) => void>,
            removers: {} as Record<string, { remove: jest.Mock }>,
            addListener: jest.fn(function (this: any, eventName: string, callback: (...args: any[]) => void) {
                this.listeners[eventName] = callback;
                const remover = {
                    remove: jest.fn(() => {}),
                };
                this.removers[eventName] = remover;
                return remover;
            }),
            _simulateEvent: jest.fn(function (this: any, eventName: string, ...args: any[]) {
                if (typeof this.listeners[eventName] === 'function') {
                    this.listeners[eventName](...args);
                }
            }),
            _getRemoveMockForEvent: jest.fn(function (this: any, eventName: string): jest.Mock | undefined {
                return this.removers[eventName]?.remove;
            }),
        };
        currentMockEmitterInstance = instance;
        return instance;
    });

    return {
        NativeEventEmitter: NativeEventEmitterMock,
        NativeModules: {
            RNPAYThreeDSecureProcessHandler: mockRNPAYThreeDSecureProcessHandler,
        },
    };
});

let PayjpThreeDSecure: typeof PayjpThreeDSecureType;

describe('PayjpThreeDSecure', () => {
    beforeEach(() => {
        jest.resetModules();
        currentMockEmitterInstance = null;
        mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess.mockClear();
        PayjpThreeDSecure = require('../src/ThreeDSecure');
        const emitter = currentMockEmitterInstance as any;
        if (emitter && emitter.addListener) {
            emitter.addListener.mockClear();
        }
    });

    describe('startThreeDSecureProcess', () => {
        it('calls native method with resourceId and handles completed status', async () => {
            const resourceId = 'charge_xxx';
            const onSucceeded = jest.fn();
            const onFailed = jest.fn();

            mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess.mockResolvedValueOnce({
                status: 'completed',
            });

            await PayjpThreeDSecure.startThreeDSecureProcess(resourceId, onSucceeded, onFailed);

            expect(mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess).toHaveBeenCalledTimes(1);
            expect(mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess).toHaveBeenCalledWith(resourceId);
            expect(onSucceeded).toHaveBeenCalledTimes(1);
            expect(onSucceeded).toHaveBeenCalledWith(PayjpThreeDSecure.ThreeDSecureProcessStatus.COMPLETED);
            expect(onFailed).not.toHaveBeenCalled();
        });

        it('handles canceled status properly', async () => {
            const resourceId = 'charge_xxx';
            const onSucceeded = jest.fn();
            const onFailed = jest.fn();

            mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess.mockResolvedValueOnce({
                status: 'canceled',
            });

            await PayjpThreeDSecure.startThreeDSecureProcess(resourceId, onSucceeded, onFailed);

            expect(onSucceeded).toHaveBeenCalledTimes(1);
            expect(onSucceeded).toHaveBeenCalledWith(PayjpThreeDSecure.ThreeDSecureProcessStatus.CANCELED);
            expect(onFailed).not.toHaveBeenCalled();
        });

        it('handles unknown status properly', async () => {
            const resourceId = 'charge_xxx';
            const onSucceeded = jest.fn();
            const onFailed = jest.fn();

            mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess.mockResolvedValueOnce({
                status: 'unknown',
            });

            await PayjpThreeDSecure.startThreeDSecureProcess(resourceId, onSucceeded, onFailed);

            expect(onSucceeded).not.toHaveBeenCalled();
            expect(onFailed).toHaveBeenCalledTimes(1);
            expect(onFailed).toHaveBeenCalledWith({
                message: expect.stringContaining('Unknown status: unknown'),
                code: 1,
            });
        });

        it('calls onFailed if native throws an error', async () => {
            const resourceId = 'charge_xxx';
            const onSucceeded = jest.fn();
            const onFailed = jest.fn();
            const error = { code: 999, message: 'fail' };

            mockRNPAYThreeDSecureProcessHandler.startThreeDSecureProcess.mockImplementationOnce(() => {
                throw error;
            });

            await PayjpThreeDSecure.startThreeDSecureProcess(resourceId, onSucceeded, onFailed);

            expect(onSucceeded).not.toHaveBeenCalled();
            expect(onFailed).toHaveBeenCalledTimes(1);
        });
    });
});
