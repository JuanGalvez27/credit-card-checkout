import { Controller, Post, Body, Res, HttpStatus, Get, Param, Put, Delete } from '@nestjs/common';
import type { Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/product/create-product.use-case';
import { GetProductUseCase } from '../../application/use-cases/product/get-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/product/delete-product.use-case';
import { CreateProductDto, UpdateProductDto } from '../../application/dto/product.dto';
import { isRight } from 'fp-ts/lib/Either';

@Controller('products')
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly getProductUseCase: GetProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
    ) { }

    @Post()
    async create(@Body() dto: CreateProductDto, @Res() res: Response) {
        const result = await this.createProductUseCase.execute(dto);
        if (isRight(result)) {
            return res.status(HttpStatus.CREATED).json(result.right);
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: result.left.message });
    }

    @Get()
    async findAll(@Res() res: Response) {
        const result = await this.getProductUseCase.executeAll();
        if (isRight(result)) {
            return res.status(HttpStatus.OK).json(result.right);
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: result.left.message });
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const result = await this.getProductUseCase.execute(id);
        if (isRight(result)) {
            return res.status(HttpStatus.OK).json(result.right);
        }
        const error = result.left;
        if (error.name === 'ProductNotFoundError') {
            return res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Res() res: Response) {
        const result = await this.updateProductUseCase.execute(id, dto);
        if (isRight(result)) {
            return res.status(HttpStatus.OK).json(result.right);
        }
        const error = result.left;
        if (error.name === 'ProductNotFoundError') {
            return res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        const result = await this.deleteProductUseCase.execute(id);
        if (isRight(result)) {
            return res.status(HttpStatus.NO_CONTENT).send();
        }
        const error = result.left;
        if (error.name === 'ProductNotFoundError') {
            return res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
