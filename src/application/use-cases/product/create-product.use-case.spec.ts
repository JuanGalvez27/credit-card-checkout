import { CreateProductUseCase } from './create-product.use-case';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { Product } from '../../../domain/models/product';

describe('CreateProductUseCase', () => {
    let useCase: CreateProductUseCase;
    let repo: ProductRepositoryPort;

    beforeEach(() => {
        repo = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new CreateProductUseCase(repo);
    });

    it('should create and return product', async () => {
        const dto = { name: 'Test', price: 10, currency: 'USD', description: 'Desc' };
        const savedProduct = new Product('1', 'Test', 10, 'USD', 'Desc');
        (repo.save as jest.Mock).mockResolvedValue(savedProduct);

        const result = await useCase.execute(dto);
        expect(result._tag).toBe('Right');
    });
});
