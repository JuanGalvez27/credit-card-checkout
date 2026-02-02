import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';
import { TransactionController } from './application/ports/in/transaction.controller';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { ProductRepositoryPort } from './application/ports/out/product-repository.port';
import { CreateTransactionUseCase } from 'domain/use-cases/transaction/create-transaction';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeORM])],
    controllers: [TransactionController],
    providers: [
        TypeOrmProductRepository,
        {
            provide: ProductRepositoryPort,
            useClass: TypeOrmProductRepository,
        },
        CreateTransactionUseCase,
    ],
})
export class TransactionModule { }
