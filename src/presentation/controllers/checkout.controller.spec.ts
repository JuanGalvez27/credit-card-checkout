import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from './checkout.controller';
import { OnboardCheckoutUseCase } from '../../application/use-cases/onboard-checkout.use-case';
import { right, left } from 'fp-ts/lib/Either';
import { ProductNotFoundError, PaymentFailedError } from '../../domain/errors/domain.error';
import { Response } from 'express';

describe('CheckoutController', () => {
    let controller: CheckoutController;
    let useCase: OnboardCheckoutUseCase;

    const mockUseCase = {
        execute: jest.fn(),
    };

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CheckoutController],
            providers: [
                {
                    provide: OnboardCheckoutUseCase,
                    useValue: mockUseCase,
                },
            ],
        }).compile();

        controller = module.get<CheckoutController>(CheckoutController);
        useCase = module.get<OnboardCheckoutUseCase>(OnboardCheckoutUseCase);
    });

    it('should return 201 Created on success', async () => {
        const dto = { productId: '1', creditCardToken: 'tok_123', currency: 'USD' };
        const result = { success: true, transactionId: 'txn_123', message: 'Success' };
        mockUseCase.execute.mockResolvedValue(right(result));

        await controller.checkout(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should return 404 Not Found on ProductNotFoundError', async () => {
        const dto = { productId: '1', creditCardToken: 'tok_123', currency: 'USD' };
        mockUseCase.execute.mockResolvedValue(left(new ProductNotFoundError('1')));

        await controller.checkout(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: 'Product with id 1 not found',
        });
    });

    it('should return 400 Bad Request on PaymentFailedError', async () => {
        const dto = { productId: '1', creditCardToken: 'tok_123', currency: 'USD' };
        mockUseCase.execute.mockResolvedValue(left(new PaymentFailedError('Insufficient funds')));

        await controller.checkout(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: 'Payment failed: Insufficient funds',
        });
    });
});
