import { TransactionMapper } from './transaction.mapper';
import { Transaction } from '../../../../../domain/entities/transaction';
import { TransactionTypeORM } from '../entities/transaction.typeorm';
import { TransactionStatus, TransactionStep } from '../../../../../domain/enums/transaction.enum';

describe('TransactionMapper', () => {
    const date = new Date();

    it('should map toDomain correctly', () => {
        const entity = new TransactionTypeORM();
        entity.id = '1';
        entity.status = TransactionStatus.PENDING;
        entity.step = TransactionStep.PAYMENT_INFO;
        entity.productId = 'prod-1';
        entity.amount = 1000;
        entity.baseFee = 10;
        entity.deliveryFee = 5;
        entity.createdAt = date;
        entity.updatedAt = date;
        entity.customerId = 'cust-1';
        entity.wompiTransactionId = 'wompi-1';
        entity.wompiReference = 'ref-1';

        const domain = TransactionMapper.toDomain(entity);

        expect(domain).toBeInstanceOf(Transaction);
        expect(domain.id).toBe('1');
        expect(domain.status).toBe(TransactionStatus.PENDING);
        expect(domain.amount).toBe(1000);
        expect(domain.wompiTransactionId).toBe('wompi-1');
    });

    it('should map toPersistence correctly', () => {
        const domain = new Transaction(
            '1',
            TransactionStatus.SUCCESS,
            TransactionStep.FINAL_STATUS,
            'prod-1',
            1000,
            10,
            5,
            date,
            date,
            'cust-1',
            'wompi-1',
            'ref-1'
        );

        const entity = TransactionMapper.toPersistence(domain);

        expect(entity).toBeInstanceOf(TransactionTypeORM);
        expect(entity.id).toBe('1');
        expect(entity.status).toBe(TransactionStatus.SUCCESS);
        expect(entity.amount).toBe(1000);
        expect(entity.wompiTransactionId).toBe('wompi-1');
    });
});
