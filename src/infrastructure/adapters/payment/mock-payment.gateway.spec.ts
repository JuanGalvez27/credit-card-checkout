import { MockPaymentGateway } from './mock-payment.gateway';

describe('MockPaymentGateway', () => {
    let gateway: MockPaymentGateway;

    beforeEach(() => {
        gateway = new MockPaymentGateway();
    });

    it('should return success for normal token', async () => {
        const result = await gateway.processPayment(100, 'USD', 'tok_123');
        expect(result.success).toBe(true);
        expect(result.transactionId).toBeDefined();
    });

    it('should return failure for error token', async () => {
        const result = await gateway.processPayment(100, 'USD', 'error_123');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Card declined');
    });
});
