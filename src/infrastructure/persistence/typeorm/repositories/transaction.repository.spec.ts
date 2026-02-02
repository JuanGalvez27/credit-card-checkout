import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTransactionRepository } from './transaction.repository';
import { TransactionTypeORM } from '../entities/transaction.typeorm';
import { Transaction } from '../../../../../domain/entities/transaction';
import { TransactionStatus, TransactionStep } from '../../../../../domain/enums/transaction.enum';

describe('TypeOrmTransactionRepository', () => {
    let repository: TypeOrmTransactionRepository;
    let typeOrmRepo: Repository<TransactionTypeORM>;

    const date = new Date();
    const mockEntity = {
        id: '1',
        status: TransactionStatus.PENDING,
        step: TransactionStep.PAYMENT_INFO,
        productId: 'prod-1',
        amount: 1000,
        baseFee: 0,
        deliveryFee: 0,
        createdAt: date,
        updatedAt: date,
        customerId: 'cust-1',
        wompiReference: 'ref-1',
    } as TransactionTypeORM;

    const mockDomain = new Transaction(
        '1',
        TransactionStatus.PENDING,
        TransactionStep.PAYMENT_INFO,
        'prod-1',
        1000,
        0,
        0,
        date,
        date,
        'cust-1',
        undefined,
        'ref-1'
    );

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmTransactionRepository,
                {
                    provide: getRepositoryToken(TransactionTypeORM),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeOrmTransactionRepository>(TypeOrmTransactionRepository);
        typeOrmRepo = module.get<Repository<TransactionTypeORM>>(getRepositoryToken(TransactionTypeORM));
    });

    it('should save transaction', async () => {
        jest.spyOn(typeOrmRepo, 'save').mockResolvedValue(mockEntity);

        const result = await repository.save(mockDomain);

        expect(typeOrmRepo.save).toHaveBeenCalled();
        expect(result.id).toBe('1');
    });

    it('should find transaction by id', async () => {
        jest.spyOn(typeOrmRepo, 'findOne').mockResolvedValue(mockEntity);

        const result = await repository.findById('1');

        expect(result).toBeDefined();
        expect(result?.id).toBe('1');
    });

    it('should return null if transaction not found', async () => {
        jest.spyOn(typeOrmRepo, 'findOne').mockResolvedValue(null);

        const result = await repository.findById('2');

        expect(result).toBeNull();
    });

    it('should update transaction', async () => {
        const updatedEntity = { ...mockEntity, status: TransactionStatus.SUCCESS };
        jest.spyOn(typeOrmRepo, 'findOne')
            .mockResolvedValueOnce(mockEntity)
            .mockResolvedValueOnce(updatedEntity);

        jest.spyOn(typeOrmRepo, 'update').mockResolvedValue({ affected: 1 } as any);

        const result = await repository.update('1', { status: TransactionStatus.SUCCESS });

        expect(typeOrmRepo.update).toHaveBeenCalled();
        expect(result?.status).toBe(TransactionStatus.SUCCESS);
    });

    it('should return null on update if transaction not found', async () => {
        jest.spyOn(typeOrmRepo, 'findOne').mockResolvedValue(null);

        const result = await repository.update('2', { status: TransactionStatus.SUCCESS });

        expect(result).toBeNull();
    });
});
