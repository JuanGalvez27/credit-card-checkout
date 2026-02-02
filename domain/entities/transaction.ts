import { TransactionStatus, TransactionStep } from "../enums/transaction.enum";

export class Transaction {
    constructor(
        public readonly id: string,
        public readonly status: TransactionStatus,
        public readonly step: TransactionStep,
        public readonly productId: string,
        public readonly amount: number,
        public readonly baseFee: number,
        public readonly deliveryFee: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly customerId?: string,
        public readonly wompiTransactionId?: string,
        public readonly wompiReference?: string,
    ) { }
}
