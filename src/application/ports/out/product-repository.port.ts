import { Product } from '../../../../domain/entities/product';

export abstract class ProductRepositoryPort {
    abstract findAll(): Promise<Product[]>;
    abstract findById(id: string): Promise<Product | null>;
    abstract save(product: Product): Promise<Product>;
    abstract update(id: string, product: Partial<Product>): Promise<Product | null>;
    abstract delete(id: string): Promise<boolean>;
}
