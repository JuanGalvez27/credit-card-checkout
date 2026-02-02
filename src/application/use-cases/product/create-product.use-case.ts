import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from 'fp-ts/lib/Either';
import { CreateProductDto } from '../../dto/product.dto';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { Product } from '../../../domain/models/product';
import { DomainError } from '../../../domain/errors/domain.error';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
    ) { }

    async execute(dto: CreateProductDto): Promise<Either<DomainError, Product>> {
        const product = new Product(
            randomUUID(),
            dto.name,
            dto.price,
            dto.currency,
            dto.description,
        );

        const savedProduct = await this.productRepository.save(product);
        return right(savedProduct);
    }
}
