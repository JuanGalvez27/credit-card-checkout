import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { CreateProductUseCase } from '../../application/use-cases/product/create-product.use-case';
import { GetProductUseCase } from '../../application/use-cases/product/get-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/product/delete-product.use-case';
import { right, left } from 'fp-ts/lib/Either';
import { Product } from '../../domain/models/product';
import { ProductNotFoundError } from '../../domain/errors/domain.error';
import type { Response } from 'express';

describe('ProductController', () => {
    let controller: ProductController;
    let createUseCase: CreateProductUseCase;
    let getUseCase: GetProductUseCase;

    const mockProduct = new Product('1', 'Test', 10, 'USD', 'Desc');

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    } as unknown as Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: CreateProductUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetProductUseCase,
                    useValue: { execute: jest.fn(), executeAll: jest.fn() },
                },
                {
                    provide: UpdateProductUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: DeleteProductUseCase,
                    useValue: { execute: jest.fn() },
                }
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        createUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
        getUseCase = module.get<GetProductUseCase>(GetProductUseCase);
    });

    it('create should return 201', async () => {
        jest.spyOn(createUseCase, 'execute').mockResolvedValue(right(mockProduct));
        await controller.create({ name: 'Test', price: 10, currency: 'USD', description: 'Desc' }, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
    });

    it('findAll should return 200', async () => {
        jest.spyOn(getUseCase, 'executeAll').mockResolvedValue(right([mockProduct]));
        await controller.findAll(mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith([mockProduct]);
    });

    it('findOne should return 404 if not found', async () => {
        jest.spyOn(getUseCase, 'execute').mockResolvedValue(left(new ProductNotFoundError('1')));
        await controller.findOne('1', mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
});
