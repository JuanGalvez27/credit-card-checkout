import { GetProductUseCase } from './get-product.use-case';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { Product } from '../../../domain/models/product';

describe('GetProductUseCase', () => {
    let useCase: GetProductUseCase;
    let repo: ProductRepositoryPort;

    beforeEach(() => {
        repo = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new GetProductUseCase(repo);
    });

    it('should return product if found', async () => {
        const product = new Product('1', 'Test', 10, 'USD', 'Desc');
        (repo.findById as jest.Mock).mockResolvedValue(product);
        const result = await useCase.execute('1');
        expect(result._tag).toBe('Right');
    });

    it('should return ProductNotFoundError if not found', async () => {
        (repo.findById as jest.Mock).mockResolvedValue(null);
        const result = await useCase.execute('1');
        expect(result._tag).toBe('Left');
    });
});
