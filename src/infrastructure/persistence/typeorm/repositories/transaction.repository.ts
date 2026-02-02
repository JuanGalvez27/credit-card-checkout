import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepositoryPort } from '../../../../application/ports/out/transaction-repository.port';
import { Transaction } from '../../../../../domain/entities/transaction';
import { TransactionTypeORM } from '../entities/transaction.typeorm';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepositoryPort {
    constructor(
        @InjectRepository(TransactionTypeORM)
        private readonly repository: Repository<TransactionTypeORM>,
    ) { }

    async save(transaction: Transaction): Promise<Transaction> {
        const entity = TransactionMapper.toPersistence(transaction);
        const savedEntity = await this.repository.save(entity);
        return TransactionMapper.toDomain(savedEntity);
    }

    async findById(id: string): Promise<Transaction | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;
        return TransactionMapper.toDomain(entity);
    }

    async findByWompiReference(reference: string): Promise<Transaction | null> {
        const entity = await this.repository.findOne({ where: { wompiReference: reference } });
        if (!entity) return null;
        return TransactionMapper.toDomain(entity);
    }

    async update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
        const existing = await this.repository.findOne({ where: { id } });
        if (!existing) return null;

        await this.repository.update(id, {
            status: transaction.status,
            step: transaction.step,
            wompiTransactionId: transaction.wompiTransactionId,
            wompiReference: transaction.wompiReference,
        });

        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) return null;
        return TransactionMapper.toDomain(updated);
    }
}

