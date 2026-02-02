import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from './get-products.use-case';
import { ProductRepositoryPort } from '../../../src/application/ports/out/product-repository.port';
import { Product } from '../../entities/product';

describe('GetProductsUseCase', () => {
    let useCase: GetProductsUseCase;
    let repository: ProductRepositoryPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetProductsUseCase,
                {
                    provide: 'ProductRepositoryPort',
                    useValue: {
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
        repository = module.get<ProductRepositoryPort>('ProductRepositoryPort');
    });

    it('should return all products', async () => {
        const products = [new Product('1', 'Test', 100, 'USD', 'Desc', 10)];
        jest.spyOn(repository, 'findAll').mockResolvedValue(products);

        const result = await useCase.execute();

        expect(repository.findAll).toHaveBeenCalled();
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right') {
            expect(result.right).toEqual(products);
        }
    });
});
