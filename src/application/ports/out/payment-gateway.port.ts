export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export interface PaymentGatewayPort {
    processPayment(amount: number, currency: string, token: string): Promise<PaymentResult>;
}
