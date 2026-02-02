import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from 'fp-ts/lib/Either';
import { CreateProductDto } from '../../../src/application/dto/product.dto';
import type { ProductRepositoryPort } from '../../../src/application/ports/out/product-repository.port';
import { DomainError } from '../../errors/domain.error';
import { randomUUID } from 'crypto';
import { Product } from 'domain/entities/product';


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
        console.log(product);
        const savedProduct = await this.productRepository.save(product);
        return right(savedProduct);
    }

}
