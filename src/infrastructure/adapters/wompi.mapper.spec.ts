import { WompiMapper } from './wompi.mapper';

describe('WompiMapper', () => {
    it('should map toWompiRequest correctly', () => {
        const input = {
            number: '1234',
            cvc: '123',
            expMonth: '12',
            expYear: '30',
            cardHolder: 'Holder'
        };
        const result = WompiMapper.toWompiRequest(input);
        expect(result).toEqual({
            number: '1234',
            cvc: '123',
            exp_month: '12',
            exp_year: '30',
            card_holder: 'Holder'
        });
    });

    it('should map toCardTokenResult correctly', () => {
        const response: any = {
            data: { id: 'token123', brand: 'VISA' }
        };
        const result = WompiMapper.toCardTokenResult(response);
        expect(result).toEqual({ token: 'token123', brand: 'VISA' });
    });

    it('should map toAcceptanceTokenResult correctly', () => {
        const response: any = {
            data: { presigned_acceptance: { acceptance_token: 'acc_token' } }
        };
        const result = WompiMapper.toAcceptanceTokenResult(response);
        expect(result).toEqual({ acceptance_token: 'acc_token' });
    });

    it('should map toWompiPaymentSourceRequest correctly', () => {
        const input = {
            type: 'CARD',
            token: 'tok_1',
            customer_email: 'test@email.com',
            acceptance_token: 'acc_token'
        };
        const result = WompiMapper.toWompiPaymentSourceRequest(input);
        expect(result).toEqual(input);
    });

    it('should map toPaymentSourceResult correctly', () => {
        const response: any = {
            data: {
                id: 123,
                type: 'CARD',
                token: 'tok_1',
                customer_email: 'test@email.com'
            }
        };
        const result = WompiMapper.toPaymentSourceResult(response);
        expect(result).toEqual({
            id: 123,
            type: 'CARD',
            token: 'tok_1',
            customer_email: 'test@email.com'
        });
    });

    it('should map toWompiTransactionRequest correctly', () => {
        const input = {
            amount_in_cents: 1000,
            currency: 'COP',
            customer_email: 'test@email.com',
            payment_method: { installments: 1 },
            reference: 'ref_1',
            payment_source_id: 123
        };
        const signature = 'sig_123';
        const result = WompiMapper.toWompiTransactionRequest(input, signature);
        expect(result).toEqual({ ...input, signature });
    });

    it('should map toTransactionResult correctly', () => {
        const response: any = {
            data: {
                id: 'trans_123',
                status: 'APPROVED',
                reference: 'ref_1',
                amount_in_cents: 1000,
                currency: 'COP'
            }
        };
        const result = WompiMapper.toTransactionResult(response);
        expect(result).toEqual({
            id: 'trans_123',
            status: 'APPROVED',
            reference: 'ref_1',
            amount_in_cents: 1000,
            currency: 'COP'
        });
    });
});
