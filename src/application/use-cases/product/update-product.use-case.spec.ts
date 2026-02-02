import { UpdateProductUseCase } from './update-product.use-case';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { Product } from '../../../domain/models/product';

describe('UpdateProductUseCase', () => {
    let useCase: UpdateProductUseCase;
    let repo: ProductRepositoryPort;

    beforeEach(() => {
        repo = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new UpdateProductUseCase(repo);
    });

    it('should update product if found', async () => {
        const product = new Product('1', 'Test', 10, 'USD', 'Desc');
        (repo.update as jest.Mock).mockResolvedValue(product);
        const result = await useCase.execute('1', { name: 'Updated' });
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right') {
            expect(result.right.name).toBe('Test'); // Mock returns 'Test'
        }
    });

    it('should return ProductNotFoundError if not found', async () => {
        (repo.update as jest.Mock).mockResolvedValue(null);
        const result = await useCase.execute('1', { name: 'Updated' });
        expect(result._tag).toBe('Left');
    });
});
