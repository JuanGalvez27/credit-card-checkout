import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TransactionStatus, TransactionStep } from '../../../../../domain/enums/transaction.enum';

@Entity('transactions')
export class TransactionTypeORM {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus;

    @Column({
        type: 'enum',
        enum: TransactionStep,
        default: TransactionStep.PRODUCT,
    })
    step: TransactionStep;

    @Column('uuid')
    productId: string;

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 15, scale: 2 })
    baseFee: number;

    @Column('decimal', { precision: 15, scale: 2 })
    deliveryFee: number;

    @Column({ nullable: true })
    customerId?: string;

    @Column({ nullable: true })
    wompiTransactionId?: string;

    @Column({ nullable: true })
    wompiReference?: string;

    @Column({ nullable: true })
    paymentSourceId?: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

