import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './presentation/controllers/product.controller';
import { CreateProductUseCase } from './application/use-cases/product/create-product.use-case';
import { GetProductUseCase } from './application/use-cases/product/get-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/product/delete-product.use-case';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeORM])],
    controllers: [ProductController],
    providers: [
        CreateProductUseCase,
        GetProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
        {
            provide: 'ProductRepositoryPort',
            useClass: TypeOrmProductRepository,
        },
    ],
})
export class ProductModule { }
