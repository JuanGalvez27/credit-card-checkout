export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainError';
    }
}

export class ProductNotFoundError extends DomainError {
    constructor(id: string) {
        super(`Product with id ${id} not found`);
        this.name = 'ProductNotFoundError';
    }
}

export class PaymentFailedError extends DomainError {
    constructor(reason: string) {
        super(`Payment failed: ${reason}`);
        this.name = 'PaymentFailedError';
    }
}
