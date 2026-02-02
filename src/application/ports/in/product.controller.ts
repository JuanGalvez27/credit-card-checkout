import { Controller, Post, Get, Body, Res, HttpStatus } from "@nestjs/common";
import type { Response } from 'express';
import { CreateProductDto } from "../../dto/product.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductUseCase } from "domain/use-cases/product/create-product.use-case";
import { GetProductsUseCase } from "domain/use-cases/product/get-products.use-case";
import { isRight } from 'fp-ts/lib/Either';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly getProductsUseCase: GetProductsUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    async create(@Body() dto: CreateProductDto, @Res() res: Response) {
        const result = await this.createProductUseCase.execute(dto);
        
        if (isRight(result)) {
            return res.status(HttpStatus.CREATED).json({
                id: result.right.id,
                name: result.right.name,
                price: result.right.price,
                currency: result.right.currency,
                description: result.right.description,
            });
        }
        
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            error: result.left.message,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'List of products' })
    async findAll(@Res() res: Response) {
        const result = await this.getProductsUseCase.execute();
        
        if (isRight(result)) {
            const products = result.right.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                description: product.description,
            }));
            
            return res.status(HttpStatus.OK).json(products);
        }
        
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: result.left.message,
        });
    }
}