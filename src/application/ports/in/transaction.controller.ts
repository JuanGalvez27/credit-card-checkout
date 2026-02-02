import { Controller, Post, Body } from "@nestjs/common";
import { CreateTransactionDto } from "../../dto/transaction.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionUseCase } from "domain/use-cases/transaction/create-transaction";

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a transaction' })
    @ApiResponse({ status: 201, description: 'Transaction created successfully' })
    async create(@Body() dto: CreateTransactionDto): Promise<void> {
        await this.createTransactionUseCase.execute(dto);
    }
}