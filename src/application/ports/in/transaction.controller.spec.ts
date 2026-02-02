import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { CreateCompleteTransactionUseCase } from '../../../../domain/use-cases/transaction/create-complete-transaction.use-case';
import { CreateTransactionDto } from '../../dto/transaction.dto';
import { Transaction } from '../../../../domain/entities/transaction';
import { TransactionStatus, TransactionStep } from '../../../../domain/enums/transaction.enum';
import { left, right } from 'fp-ts/lib/Either';
import { ProductNotFoundError } from '../../../../domain/errors/domain.error';
import { Response } from 'express';

describe('TransactionController', () => {
    let controller: TransactionController;
    let useCase: CreateCompleteTransactionUseCase;

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [
                {
                    provide: CreateCompleteTransactionUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
        useCase = module.get<CreateCompleteTransactionUseCase>(CreateCompleteTransactionUseCase);
        jest.clearAllMocks();
    });

    it('should create transaction successfully', async () => {
        const dto = new CreateTransactionDto();
        jest.spyOn(useCase, 'execute').mockResolvedValue(right(mockTransaction));

        await controller.create(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            id: mockTransaction.id,
            status: mockTransaction.status,
        }));
    });

    it('should return 404 if product not found', async () => {
        const dto = new CreateTransactionDto();
        const error = new ProductNotFoundError('prod-1');
        jest.spyOn(useCase, 'execute').mockResolvedValue(left(error));

        await controller.create(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: error.message,
        });
    });

    it('should return 400 for other errors', async () => {
        const dto = new CreateTransactionDto();
        const error = new Error('Some error');
        jest.spyOn(useCase, 'execute').mockResolvedValue(left(error));

        await controller.create(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: 'Some error',
        });
    });
});
