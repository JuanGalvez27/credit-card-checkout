import { Test, TestingModule } from '@nestjs/testing';
import { WompiAdapter } from './wompi.adapter';
import { WompiHttpClient } from './wompi.http-client';
import { ConfigService } from '@nestjs/config';
import { WompiSignatureUtil } from './wompi-signature.util';

describe('WompiAdapter', () => {
    let adapter: WompiAdapter;
    let httpClient: WompiHttpClient;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WompiAdapter,
                {
                    provide: WompiHttpClient,
                    useValue: {
                        tokenizeCard: jest.fn(),
                        getAcceptanceToken: jest.fn(),
                        createPaymentSource: jest.fn(),
                        createTransaction: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('secret'),
                    },
                },
            ],
        }).compile();

        adapter = module.get<WompiAdapter>(WompiAdapter);
        httpClient = module.get<WompiHttpClient>(WompiHttpClient);
    });

    it('should tokenize card', async () => {
        const input = {
            number: '1234',
            cvc: '123',
            expMonth: '12',
            expYear: '30',
            cardHolder: 'Holder',
        };
        const response = {
            data: { id: 'tok_1', brand: 'VISA' },
        };
        jest.spyOn(httpClient, 'tokenizeCard').mockResolvedValue(response as any);

        const result = await adapter.tokenizeCard(input);

        expect(result).toEqual({ token: 'tok_1', brand: 'VISA' });
        expect(httpClient.tokenizeCard).toHaveBeenCalled();
    });

    it('should get acceptance token', async () => {
        const response = {
            data: { presigned_acceptance: { acceptance_token: 'acc_token' } },
        };
        jest.spyOn(httpClient, 'getAcceptanceToken').mockResolvedValue(response as any);

        const result = await adapter.getAcceptanceToken();

        expect(result).toEqual({ acceptance_token: 'acc_token' });
    });

    it('should create payment source', async () => {
        const input = {
            type: 'CARD',
            token: 'tok_1',
            customer_email: 'test@email.com',
            acceptance_token: 'acc_token',
        };
        const response = {
            data: { id: 123, type: 'CARD', token: 'tok_1', customer_email: 'test@email.com' },
        };
        jest.spyOn(httpClient, 'createPaymentSource').mockResolvedValue(response as any);

        const result = await adapter.createPaymentSource(input);

        expect(httpClient.createPaymentSource).toHaveBeenCalled();
        expect(result.id).toBe(123);
    });

    it('should create transaction with signature', async () => {
        const input = {
            amount_in_cents: 1000,
            currency: 'COP',
            customer_email: 'test@email.com',
            payment_method: { installments: 1 },
            reference: 'ref_1',
            payment_source_id: 123,
        };

        jest.spyOn(WompiSignatureUtil, 'calculateSignature').mockResolvedValue('mock_sig');

        const response = {
            data: {
                id: 'trans_123',
                status: 'APPROVED',
                reference: 'ref_1',
                amount_in_cents: 1000,
                currency: 'COP',
            },
        };
        jest.spyOn(httpClient, 'createTransaction').mockResolvedValue(response as any);

        const result = await adapter.createTransaction(input);

        expect(WompiSignatureUtil.calculateSignature).toHaveBeenCalledWith(
            input.reference,
            input.amount_in_cents,
            input.currency,
            'secret'
        );
        expect(httpClient.createTransaction).toHaveBeenCalledWith(
            expect.objectContaining({ signature: 'mock_sig' })
        );
        expect(result.id).toBe('trans_123');
    });
});
