import { DeleteProductUseCase } from './delete-product.use-case';
import type { ProductRepositoryPort } from '../../ports/out/product-repository.port';

describe('DeleteProductUseCase', () => {
    let useCase: DeleteProductUseCase;
    let repo: ProductRepositoryPort;

    beforeEach(() => {
        repo = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        useCase = new DeleteProductUseCase(repo);
    });

    it('should delete product if found', async () => {
        (repo.delete as jest.Mock).mockResolvedValue(true);
        const result = await useCase.execute('1');
        expect(result._tag).toBe('Right');
    });

    it('should return ProductNotFoundError if not found', async () => {
        (repo.delete as jest.Mock).mockResolvedValue(false);
        const result = await useCase.execute('1');
        expect(result._tag).toBe('Left');
    });
});
