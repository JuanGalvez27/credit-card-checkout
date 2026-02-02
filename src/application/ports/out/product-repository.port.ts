import type { Product } from '../../../domain/models/product';

export interface ProductRepositoryPort {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    save(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<boolean>;
}
