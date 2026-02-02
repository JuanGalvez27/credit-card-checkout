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
        stock: 10,
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
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
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

    it('save should return saved product', async () => {
        const product = { id: '1', name: 'Test', price: 100, currency: 'USD', description: 'Desc', stock: 10 };
        jest.spyOn(typeOrmRepo, 'save').mockResolvedValue(mockEntity);
        // @ts-ignore
        const result = await repository.save(product);
        expect(result.id).toBe('1');
    });

    it('update should return updated product', async () => {
        jest.spyOn(typeOrmRepo, 'findOne').mockResolvedValue(mockEntity);
        jest.spyOn(typeOrmRepo, 'update').mockResolvedValue({ affected: 1 } as any);

        const result = await repository.update('1', { name: 'Updated' });
        expect(result?.id).toBe('1');
    });

    it('delete should return true if found', async () => {
        jest.spyOn(typeOrmRepo, 'delete').mockResolvedValue({ affected: 1 } as any);
        const result = await repository.delete('1');
        expect(result).toBe(true);
    });
});
