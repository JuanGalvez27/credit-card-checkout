import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { CreateProductUseCase } from '../../../../domain/use-cases/product/create-product.use-case';
import { GetProductsUseCase } from '../../../../domain/use-cases/product/get-products.use-case';
import { CreateProductDto } from '../../dto/product.dto';
import { Product } from '../../../../domain/entities/product';
import { right, left } from 'fp-ts/lib/Either';
import { Response } from 'express';

describe('ProductController', () => {
    let controller: ProductController;
    let createUseCase: CreateProductUseCase;
    let getUseCase: GetProductsUseCase;

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: CreateProductUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: GetProductsUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        createUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
        getUseCase = module.get<GetProductsUseCase>(GetProductsUseCase);
        jest.clearAllMocks();
    });

    it('should create product', async () => {
        const dto: CreateProductDto = { name: 'Test', price: 100, currency: 'USD', description: 'Desc', stock: 10 };
        const product = new Product('1', 'Test', 100, 'USD', 'Desc', 10);
        jest.spyOn(createUseCase, 'execute').mockResolvedValue(right(product));

        await controller.create(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });

    it('should handle create error', async () => {
        const dto: CreateProductDto = { name: 'Test', price: 100, currency: 'USD', description: 'Desc', stock: 10 };
        jest.spyOn(createUseCase, 'execute').mockResolvedValue(left(new Error('Error')));

        await controller.create(dto, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should find all products', async () => {
        const products = [new Product('1', 'Test', 100, 'USD', 'Desc', 10)];
        jest.spyOn(getUseCase, 'execute').mockResolvedValue(right(products));

        await controller.findAll(mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: '1' })]));
    });

    it('should handle find all error', async () => {
        jest.spyOn(getUseCase, 'execute').mockResolvedValue(left(new Error('Error')));

        await controller.findAll(mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
});
