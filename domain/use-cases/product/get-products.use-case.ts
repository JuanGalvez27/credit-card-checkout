import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from 'fp-ts/lib/Either';
import type { ProductRepositoryPort } from '../../../src/application/ports/out/product-repository.port';
import { DomainError } from '../../errors/domain.error';
import { Product } from '../../entities/product';

@Injectable()
export class GetProductsUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
    ) { }

    async execute(): Promise<Either<DomainError, Product[]>> {
        const products = await this.productRepository.findAll();
        return right(products);
    }
}
