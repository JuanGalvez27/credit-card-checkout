import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from './create-product.use-case';
import { ProductRepositoryPort } from '../../../src/application/ports/out/product-repository.port';
import { CreateProductDto } from '../../../src/application/dto/product.dto';
import { Product } from '../../entities/product';

describe('CreateProductUseCase', () => {
    let useCase: CreateProductUseCase;
    let repository: ProductRepositoryPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateProductUseCase,
                {
                    provide: 'ProductRepositoryPort',
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
        repository = module.get<ProductRepositoryPort>('ProductRepositoryPort');
    });

    it('should create a product', async () => {
        const dto: CreateProductDto = {
            name: 'Test Product',
            price: 1000,
            currency: 'USD',
            description: 'Test Description',
            stock: 10,
        };
        const savedProduct = new Product('1', 'Test Product', 1000, 'USD', 'Test Description', 10);
        jest.spyOn(repository, 'save').mockResolvedValue(savedProduct);

        const result = await useCase.execute(dto);

        expect(repository.save).toHaveBeenCalled();
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right') {
            expect(result.right).toEqual(savedProduct);
        }
    });
});
