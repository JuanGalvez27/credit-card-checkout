import { Test, TestingModule } from '@nestjs/testing';
import { CreateCompleteTransactionUseCase } from './create-complete-transaction.use-case';
import { ProductRepositoryPort } from '../../../src/application/ports/out/product-repository.port';
import { PaymentGatewayPort } from '../../../src/application/ports/out/payment-gateway.port';
import { TransactionRepositoryPort } from '../../../src/application/ports/out/transaction-repository.port';
import { ConfigService } from '@nestjs/config';
import { CreateTransactionDto } from '../../../src/application/dto/transaction.dto';
import { Product } from '../../entities/product';
import { Transaction } from '../../entities/transaction';
import { TransactionStatus, TransactionStep } from '../../enums/transaction.enum';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { ProductNotFoundError } from '../../errors/domain.error';

describe('CreateCompleteTransactionUseCase', () => {
    let useCase: CreateCompleteTransactionUseCase;
    let productRepository: ProductRepositoryPort;
    let paymentGateway: PaymentGatewayPort;
    let transactionRepository: TransactionRepositoryPort;

    const mockProduct = new Product('prod-1', 'Test Product', 10000, 'COP', 'Desc', 10);
    const mockTransaction = new Transaction(
        'trans-1',
        TransactionStatus.PENDING,
        TransactionStep.PAYMENT_INFO,
        'prod-1',
        10000,
        0,
        0,
        new Date(),
        new Date(),
        'cust-1',
        undefined,
        'ref-1'
    );

    const mockDto: CreateTransactionDto = {
        productId: 'prod-1',
        amount: 10000,
        baseFee: 0,
        deliveryFee: 0,
        customerId: 'cust-1',
        customerEmail: 'test@mail.com',
        cardNumber: '4242',
        cardCvc: '123',
        cardExpMonth: '12',
        cardExpYear: '30',
        cardHolder: 'John Doe',
        installments: 1
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateCompleteTransactionUseCase,
                {
                    provide: 'ProductRepositoryPort',
                    useValue: {
                        findById: jest.fn(),
                    },
                },
                {
                    provide: 'PaymentGatewayPort',
                    useValue: {
                        tokenizeCard: jest.fn(),
                        getAcceptanceToken: jest.fn(),
                        createPaymentSource: jest.fn(),
                        createTransaction: jest.fn(),
                    },
                },
                {
                    provide: 'TransactionRepositoryPort',
                    useValue: {
                        save: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<CreateCompleteTransactionUseCase>(CreateCompleteTransactionUseCase);
        productRepository = module.get('ProductRepositoryPort');
        paymentGateway = module.get('PaymentGatewayPort');
        transactionRepository = module.get('TransactionRepositoryPort');
    });

    it('should return ProductNotFoundError if product does not exist', async () => {
        jest.spyOn(productRepository, 'findById').mockResolvedValue(null);

        const result = await useCase.execute(mockDto);

        expect(isLeft(result)).toBeTruthy();
        if (isLeft(result)) {
            expect(result.left).toBeInstanceOf(ProductNotFoundError);
        }
    });

    it('should successfully create a transaction', async () => {
        jest.spyOn(productRepository, 'findById').mockResolvedValue(mockProduct);
        jest.spyOn(transactionRepository, 'save').mockResolvedValue(mockTransaction);

        jest.spyOn(paymentGateway, 'tokenizeCard').mockResolvedValue({ token: 'tok-123', brand: 'VISA' });
        jest.spyOn(paymentGateway, 'getAcceptanceToken').mockResolvedValue({ acceptance_token: 'acc-123' });
        jest.spyOn(paymentGateway, 'createPaymentSource').mockResolvedValue({ id: 123, type: 'CARD', token: 'tok_1', customer_email: 'test@mail.com' });
        jest.spyOn(paymentGateway, 'createTransaction').mockResolvedValue({
            id: 'wompi-id',
            status: 'APPROVED',
            amount_in_cents: 10000,
            reference: 'ref-1',
            currency: 'COP',
        });

        const updatedTransaction = { ...mockTransaction, status: TransactionStatus.SUCCESS, wompiTransactionId: 'wompi-id' };
        jest.spyOn(transactionRepository, 'update').mockResolvedValue(updatedTransaction);

        const result = await useCase.execute(mockDto);

        expect(isRight(result)).toBeTruthy();
        expect(transactionRepository.save).toHaveBeenCalled();
        expect(paymentGateway.tokenizeCard).toHaveBeenCalled();
        expect(paymentGateway.createTransaction).toHaveBeenCalled();
        expect(transactionRepository.update).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ status: TransactionStatus.SUCCESS })
        );
    });

    it('should fail if payment gateway throws error and update transaction to FAILED', async () => {
        jest.spyOn(productRepository, 'findById').mockResolvedValue(mockProduct);
        jest.spyOn(transactionRepository, 'save').mockResolvedValue(mockTransaction);

        jest.spyOn(paymentGateway, 'tokenizeCard').mockRejectedValue(new Error('Gateway Error'));

        const result = await useCase.execute(mockDto);

        expect(isLeft(result)).toBeTruthy();
        expect(transactionRepository.update).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ status: TransactionStatus.FAILED })
        );
    });
});
