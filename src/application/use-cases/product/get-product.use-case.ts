import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'fp-ts/lib/Either';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { Product } from '../../../domain/models/product';
import { DomainError, ProductNotFoundError } from '../../../domain/errors/domain.error';

@Injectable()
export class GetProductUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
    ) { }

    async execute(id: string): Promise<Either<DomainError, Product>> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            return left(new ProductNotFoundError(id));
        }
        return right(product);
    }

    async executeAll(): Promise<Either<DomainError, Product[]>> {
        const products = await this.productRepository.findAll();
        return right(products);
    }
}
