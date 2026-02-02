import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { OnboardCheckoutUseCase } from '../../application/use-cases/onboard-checkout.use-case';
import { CheckoutDto } from '../../application/dto/checkout.dto';
import { isRight } from 'fp-ts/lib/Either';

@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutUseCase: OnboardCheckoutUseCase) { }

    @Post()
    async checkout(@Body() dto: CheckoutDto, @Res() res: Response) {
        const result = await this.checkoutUseCase.execute(dto);

        if (isRight(result)) {
            return res.status(HttpStatus.CREATED).json(result.right);
        }

        const error = result.left;
        switch (error.name) {
            case 'ProductNotFoundError':
                return res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    error: error.message,
                });
            case 'PaymentFailedError':
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                });
            default:
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: 'Internal Server Error',
                });
        }
    }
}
