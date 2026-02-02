import { Injectable } from '@nestjs/common';
import { PaymentGatewayPort, PaymentResult } from '../../../application/ports/out/payment-gateway.port';

@Injectable()
export class MockPaymentGateway implements PaymentGatewayPort {
    async processPayment(amount: number, currency: string, token: string): Promise<PaymentResult> {
        console.log(`Processing payment of ${amount} ${currency} with token ${token}`);

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simple logic: if token starts with 'error', fail.
        if (token.startsWith('error')) {
            return {
                success: false,
                error: 'Card declined',
            };
        }

        return {
            success: true,
            transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        };
    }
}
