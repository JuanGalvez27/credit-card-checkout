import { Transaction } from '../../../../../domain/entities/transaction';
import { TransactionTypeORM } from '../entities/transaction.typeorm';

export class TransactionMapper {
    static toDomain(entity: TransactionTypeORM): Transaction {
        return new Transaction(
            entity.id,
            entity.status,
            entity.step,
            entity.productId,
            Number(entity.amount),
            Number(entity.baseFee),
            Number(entity.deliveryFee),
            entity.createdAt,
            entity.updatedAt,
            entity.customerId,
            entity.wompiTransactionId,
            entity.wompiReference,
        );
    }

    static toPersistence(domain: Transaction): TransactionTypeORM {
        const entity = new TransactionTypeORM();
        entity.id = domain.id;
        entity.status = domain.status;
        entity.step = domain.step;
        entity.productId = domain.productId;
        entity.amount = domain.amount;
        entity.baseFee = domain.baseFee;
        entity.deliveryFee = domain.deliveryFee;
        entity.customerId = domain.customerId;
        entity.wompiTransactionId = domain.wompiTransactionId;
        entity.wompiReference = domain.wompiReference;
        return entity;
    }
}

