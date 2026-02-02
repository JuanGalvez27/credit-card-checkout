import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './application/ports/in/product.controller';
import { CreateProductUseCase } from '../domain/use-cases/product/create-product.use-case';
import { GetProductsUseCase } from '../domain/use-cases/product/get-products.use-case';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeORM])],
    controllers: [ProductController],
    providers: [
        CreateProductUseCase,
        GetProductsUseCase,
        {
            provide: 'ProductRepositoryPort',
            useClass: TypeOrmProductRepository,
        },
    ],
})
export class ProductModule { }
