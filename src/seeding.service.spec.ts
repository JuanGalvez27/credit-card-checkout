import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedingService } from './seeding.service';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';

describe('SeedingService', () => {
    let service: SeedingService;
    let repo: Repository<ProductTypeORM>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeedingService,
                {
                    provide: getRepositoryToken(ProductTypeORM),
                    useValue: {
                        count: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SeedingService>(SeedingService);
        repo = module.get<Repository<ProductTypeORM>>(getRepositoryToken(ProductTypeORM));
    });

    it('should seed if count is 0', async () => {
        jest.spyOn(repo, 'count').mockResolvedValue(0);
        await service.onApplicationBootstrap();
        expect(repo.save).toHaveBeenCalled();
    });

    it('should not seed if count is > 0', async () => {
        jest.spyOn(repo, 'count').mockResolvedValue(5);
        await service.onApplicationBootstrap();
        expect(repo.save).not.toHaveBeenCalled();
    });
});
