import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';
import { TransactionTypeORM } from './infrastructure/persistence/typeorm/entities/transaction.typeorm';
import { TransactionController } from './application/ports/in/transaction.controller';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { TypeOrmTransactionRepository } from './infrastructure/persistence/typeorm/repositories/transaction.repository';
import { ProductRepositoryPort } from './application/ports/out/product-repository.port';
import { TransactionRepositoryPort } from './application/ports/out/transaction-repository.port';
import { CreateCompleteTransactionUseCase } from '../domain/use-cases/transaction/create-complete-transaction.use-case';
import { WompiHttpClient } from './infrastructure/adapters/wompi.http-client';
import { WompiAdapter } from './infrastructure/adapters/wompi.adapter';
import { PaymentGatewayPort } from './application/ports/out/payment-gateway.port';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductTypeORM, TransactionTypeORM]),
    ],
    controllers: [TransactionController],
    providers: [
        // Repositories
        TypeOrmProductRepository,
        TypeOrmTransactionRepository,
        {
            provide: 'ProductRepositoryPort',
            useClass: TypeOrmProductRepository,
        },
        {
            provide: 'TransactionRepositoryPort',
            useClass: TypeOrmTransactionRepository,
        },
        // Payment Gateway
        WompiHttpClient,
        WompiAdapter,
        {
            provide: 'PaymentGatewayPort',
            useClass: WompiAdapter,
        },
        // Use Cases
        CreateCompleteTransactionUseCase,
    ],
})
export class TransactionModule { }
