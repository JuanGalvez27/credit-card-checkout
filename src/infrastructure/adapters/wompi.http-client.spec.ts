import { Test, TestingModule } from '@nestjs/testing';
import { WompiHttpClient } from './wompi.http-client';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiHttpClient', () => {
    let service: WompiHttpClient;
    let configService: ConfigService;

    const mockAxiosInstance = {
        post: jest.fn(),
        get: jest.fn(),
    };

    beforeEach(async () => {
        mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WompiHttpClient,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            switch (key) {
                                case 'UAT_SANDBOX_URL': return 'https://test.url';
                                case 'API_KEY_PUB': return 'pub_key';
                                case 'API_KEY_PRIV': return 'priv_key';
                                default: return null;
                            }
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<WompiHttpClient>(WompiHttpClient);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should tokenize card', async () => {
        const request = {
            number: '1234',
            cvc: '123',
            exp_month: '12',
            exp_year: '30',
            card_holder: 'Test',
        };
        const response = { data: { data: { id: 'tok_1' } } };
        mockAxiosInstance.post.mockResolvedValue(response);

        const result = await service.tokenizeCard(request);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            '/tokens/cards',
            request,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer pub_key',
                }),
            }),
        );
        expect(result).toEqual(response.data);
    });

    it('should get acceptance token', async () => {
        const response = { data: { data: { presigned_acceptance: { acceptance_token: 'acc_1' } } } };
        mockAxiosInstance.get.mockResolvedValue(response);

        const result = await service.getAcceptanceToken();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
            '/merchants/pub_key',
            expect.anything(),
        );
        expect(result).toEqual(response.data);
    });

    it('should create payment source', async () => {
        const request = {
            type: 'CARD',
            token: 'tok_1',
            customer_email: 'test@mail.com',
            acceptance_token: 'acc_1',
        };
        const response = { data: { data: { id: 123 } } };
        mockAxiosInstance.post.mockResolvedValue(response);

        const result = await service.createPaymentSource(request);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            '/payment_sources',
            request,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer priv_key',
                }),
            }),
        );
        expect(result).toEqual(response.data);
    });

    it('should create transaction', async () => {
        const request = {
            amount_in_cents: 1000,
            currency: 'COP',
            customer_email: 'test@mail.com',
            payment_method: { installments: 1 },
            reference: 'ref_1',
            payment_source_id: 123,
            signature: 'sig_1',
        };
        const response = { data: { data: { id: 'trans_1' } } };
        mockAxiosInstance.post.mockResolvedValue(response);

        const result = await service.createTransaction(request);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            '/transactions',
            request,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer priv_key',
                }),
            }),
        );
        expect(result).toEqual(response.data);
    });
});
