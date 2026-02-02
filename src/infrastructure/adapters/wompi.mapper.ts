import {
    CreateCardTokenInput,
    CardTokenResult,
    AcceptanceTokenResult,
    CreatePaymentSourceInput,
    PaymentSourceResult,
    CreateTransactionInput,
    TransactionResult,
} from '../../application/ports/out/payment-gateway.port';
import {
    WompiTokenizeCardRequest,
    WompiTokenizeCardResponse,
    WompiAcceptanceTokenResponse,
    WompiPaymentSourceRequest,
    WompiPaymentSourceResponse,
    WompiTransactionRequest,
    WompiTransactionResponse,
} from './wompi.http-client';

export class WompiMapper {
    static toWompiRequest(input: CreateCardTokenInput): WompiTokenizeCardRequest {
        return {
            number: input.number.replace(/\s+/g, ''),
            cvc: input.cvc,
            exp_month: input.expMonth,
            exp_year: input.expYear,
            card_holder: input.cardHolder,
        };
    }

    static toCardTokenResult(response: WompiTokenizeCardResponse): CardTokenResult {
        return {
            token: response.data.id,
            brand: response.data.brand,
        };
    }

    static toAcceptanceTokenResult(response: WompiAcceptanceTokenResponse): AcceptanceTokenResult {
        return {
            acceptance_token: response.data.presigned_acceptance.acceptance_token,
        };
    }

    static toWompiPaymentSourceRequest(input: CreatePaymentSourceInput): WompiPaymentSourceRequest {
        return {
            type: input.type,
            token: input.token,
            customer_email: input.customer_email,
            acceptance_token: input.acceptance_token,
        };
    }

    static toPaymentSourceResult(response: WompiPaymentSourceResponse): PaymentSourceResult {
        return {
            id: response.data.id,
            type: response.data.type,
            token: response.data.token,
            customer_email: response.data.customer_email,
        };
    }

    static toWompiTransactionRequest(input: CreateTransactionInput, signature: string): WompiTransactionRequest {
        return {
            amount_in_cents: input.amount_in_cents,
            currency: input.currency,
            customer_email: input.customer_email,
            payment_method: input.payment_method,
            reference: input.reference,
            payment_source_id: input.payment_source_id,
            signature: signature,
        };
    }

    static toTransactionResult(response: WompiTransactionResponse): TransactionResult {
        return {
            id: response.data.id,
            status: response.data.status,
            reference: response.data.reference,
            amount_in_cents: response.data.amount_in_cents,
            currency: response.data.currency,
        };
    }
}

