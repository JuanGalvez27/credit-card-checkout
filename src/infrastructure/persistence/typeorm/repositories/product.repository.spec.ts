import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmProductRepository } from './product.repository';
import { ProductTypeORM } from '../entities/product.typeorm';

describe('TypeOrmProductRepository', () => {
    let repository: TypeOrmProductRepository;
    let typeOrmRepo: Repository<ProductTypeORM>;

    const mockEntity = {
        id: '1',
        name: 'Test',
        price: 100,
        currency: 'USD',
        description: 'Desc',
    } as ProductTypeORM;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmProductRepository,
                {
                    provide: getRepositoryToken(ProductTypeORM),
                    useValue: {
                        find: jest.fn().mockResolvedValue([mockEntity]),
                        findOne: jest.fn().mockResolvedValue(mockEntity),
                    },
                },
            ],
        }).compile();

        repository = module.get<TypeOrmProductRepository>(TypeOrmProductRepository);
        typeOrmRepo = module.get<Repository<ProductTypeORM>>(getRepositoryToken(ProductTypeORM));
    });

    it('findAll shoud return domain products', async () => {
        const result = await repository.findAll();
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('findById should return domain product if found', async () => {
        const result = await repository.findById('1');
        expect(result).not.toBeNull();
        expect(result?.id).toBe('1');
    });

    it('findById should return null if not found', async () => {
        jest.spyOn(typeOrmRepo, 'findOne').mockResolvedValue(null);
        const result = await repository.findById('2');
        expect(result).toBeNull();
    });
});
