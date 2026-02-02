export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly currency: string,
        public readonly description: string,
    ) { }
}
