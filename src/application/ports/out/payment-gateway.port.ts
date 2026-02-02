export interface CreateCardTokenInput {
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardHolder: string;
}

export interface CardTokenResult {
    token: string;
    brand: string;
}

export interface AcceptanceTokenResult {
    acceptance_token: string;
}

export interface CreatePaymentSourceInput {
    type: string;
    token: string;
    customer_email: string;
    acceptance_token: string;
}

export interface PaymentSourceResult {
    id: number;
    type: string;
    token: string;
    customer_email: string;
}

export interface CreateTransactionInput {
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method: {
        installments: number;
    };
    reference: string;
    payment_source_id: number;
}

export interface TransactionResult {
    id: string;
    status: string;
    reference: string;
    amount_in_cents: number;
    currency: string;
}

export interface PaymentGatewayPort {
    tokenizeCard(input: CreateCardTokenInput): Promise<CardTokenResult>;
    getAcceptanceToken(): Promise<AcceptanceTokenResult>;
    createPaymentSource(input: CreatePaymentSourceInput): Promise<PaymentSourceResult>;
    createTransaction(input: CreateTransactionInput): Promise<TransactionResult>;
}