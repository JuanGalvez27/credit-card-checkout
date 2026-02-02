import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'fp-ts/lib/Either';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { DomainError, ProductNotFoundError } from '../../../domain/errors/domain.error';

@Injectable()
export class DeleteProductUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
    ) { }

    async execute(id: string): Promise<Either<DomainError, boolean>> {
        const deleted = await this.productRepository.delete(id);
        if (!deleted) {
            return left(new ProductNotFoundError(id));
        }
        return right(true);
    }
}
