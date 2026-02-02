import { Transaction } from '../../../../domain/entities/transaction';

export abstract class TransactionRepositoryPort {
    abstract save(transaction: Transaction): Promise<Transaction>;
    abstract findById(id: string): Promise<Transaction | null>;
    abstract findByWompiReference(reference: string): Promise<Transaction | null>;
    abstract update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null>;
}

