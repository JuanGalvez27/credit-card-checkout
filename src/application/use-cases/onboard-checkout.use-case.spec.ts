import { OnboardCheckoutUseCase } from './onboard-checkout.use-case';
import { ProductRepositoryPort } from '../ports/out/product-repository.port';
import { PaymentGatewayPort } from '../ports/out/payment-gateway.port';
import { Product } from '../../domain/models/product';
import { isLeft, isRight } from 'fp-ts/lib/Either';

describe('OnboardCheckoutUseCase', () => {
    let useCase: OnboardCheckoutUseCase;
    let productRepo: ProductRepositoryPort;
    let paymentGateway: PaymentGatewayPort;

    const mockProduct = new Product('1', 'Test Product', 100, 'USD', 'Description');

    beforeEach(() => {
        productRepo = {
            findById: jest.fn(),
            findAll: jest.fn(),
        };
        paymentGateway = {
            processPayment: jest.fn(),
        };
        useCase = new OnboardCheckoutUseCase(productRepo, paymentGateway);
    });

    it('should return success when product exists and payment succeeds', async () => {
        (productRepo.findById as jest.Mock).mockResolvedValue(mockProduct);
        (paymentGateway.processPayment as jest.Mock).mockResolvedValue({ success: true, transactionId: 'txn_1' });

        const result = await useCase.execute({ productId: '1', creditCardToken: 'tok_1', currency: 'USD' });

        expect(isRight(result)).toBe(true);
        if (isRight(result)) {
            expect(result.right.success).toBe(true);
            expect(result.right.transactionId).toBe('txn_1');
        }
    });

    it('should return ProductNotFoundError when product does not exist', async () => {
        (productRepo.findById as jest.Mock).mockResolvedValue(null);

        const result = await useCase.execute({ productId: '2', creditCardToken: 'tok_1', currency: 'USD' });

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
            expect(result.left.name).toBe('ProductNotFoundError');
        }
    });

    it('should return PaymentFailedError when payment fails', async () => {
        (productRepo.findById as jest.Mock).mockResolvedValue(mockProduct);
        (paymentGateway.processPayment as jest.Mock).mockResolvedValue({ success: false, error: 'Declined' });

        const result = await useCase.execute({ productId: '1', creditCardToken: 'tok_1', currency: 'USD' });

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
            expect(result.left.name).toBe('PaymentFailedError');
            expect(result.left.message).toContain('Declined');
        }
    });
});
