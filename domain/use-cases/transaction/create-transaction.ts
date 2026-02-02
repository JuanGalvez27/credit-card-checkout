import { Transaction } from "../../entities/transaction";
import { TransactionStatus, TransactionStep } from "../../enums/transaction.enum";
// import { TransactionRepositoryPort } from "../../ports/out/transaction-repository.port";
import { CreateTransactionDto } from "../../../src/application/dto/transaction.dto"; // Adjust path if needed
import { randomUUID } from 'crypto';
import { Console } from "console";

export class CreateTransactionUseCase {
    constructor(
        // private readonly TransactionRepository: TransactionRepositoryPort,
    ) { }

    async execute(dto: CreateTransactionDto): Promise<void> {
        const transaction = new Transaction(
            randomUUID(),
            TransactionStatus.PENDING,
            TransactionStep.PRODUCT,
            dto.productId,
            dto.amount,
            dto.baseFee,
            dto.deliveryFee,
            new Date(),
            new Date(),
            dto.customerId,
            dto.wompiTransactionId,
            dto.wompiReference,
        );
        console.log(transaction);
        console.log("Bingo!");
        // await this.TransactionRepository.save(transaction);
    }
}
