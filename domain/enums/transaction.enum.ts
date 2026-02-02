export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum TransactionStep {
    PRODUCT = 'PRODUCT',
    PAYMENT_INFO = 'PAYMENT_INFO',
    SUMMARY = 'SUMMARY',
    FINAL_STATUS = 'FINAL_STATUS',
    COMPLETED = 'COMPLETED',
}
