import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './typeorm.config';

describe('TypeOrmConfigService', () => {
    let service: TypeOrmConfigService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmConfigService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key) => {
                            if (key === 'DATABASE_PORT') return 5432;
                            return key;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should create typeorm options', () => {
        const options = service.createTypeOrmOptions();
        expect(options).toBeDefined();
        expect(options.type).toBe('postgres');
        expect(configService.get).toHaveBeenCalledWith('DATABASE_HOST');
    });
});
