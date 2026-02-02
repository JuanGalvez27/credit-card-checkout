import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import type { Response } from 'express';
import { CreateTransactionDto } from "../../dto/transaction.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCompleteTransactionUseCase } from "../../../../domain/use-cases/transaction/create-complete-transaction.use-case";
import { isRight } from 'fp-ts/lib/Either';
import { Transaction } from '../../../../domain/entities/transaction';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly createCompleteTransactionUseCase: CreateCompleteTransactionUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a complete transaction (DB + Wompi)' })
    @ApiResponse({ status: 201, description: 'Transaction created successfully' })
    @ApiResponse({ status: 400, description: 'Transaction creation failed' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async create(@Body() dto: CreateTransactionDto, @Res() res: Response) {
        const result = await this.createCompleteTransactionUseCase.execute(dto);
        if (isRight(result)) {
            const transaction: Transaction = result.right;
            return res.status(HttpStatus.CREATED).json({
                id: transaction.id,
                status: transaction.status,
                step: transaction.step,
                productId: transaction.productId,
                amount: transaction.amount,
                wompiTransactionId: transaction.wompiTransactionId,
                wompiReference: transaction.wompiReference,
                createdAt: transaction.createdAt,
            });
        }

        const error = result.left;
        if (error.name === 'ProductNotFoundError') {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                error: error.message,
            });
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            error: error.message,
        });
    }
}