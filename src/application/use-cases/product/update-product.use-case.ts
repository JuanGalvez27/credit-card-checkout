import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'fp-ts/lib/Either';
import { UpdateProductDto } from '../../dto/product.dto';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { Product } from '../../../domain/models/product';
import { DomainError, ProductNotFoundError } from '../../../domain/errors/domain.error';

@Injectable()
export class UpdateProductUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
    ) { }

    async execute(id: string, dto: UpdateProductDto): Promise<Either<DomainError, Product>> {
        const updatedProduct = await this.productRepository.update(id, {
            name: dto.name,
            price: dto.price,
            currency: dto.currency,
            description: dto.description
        });

        if (!updatedProduct) {
            return left(new ProductNotFoundError(id));
        }

        return right(updatedProduct);
    }
}
