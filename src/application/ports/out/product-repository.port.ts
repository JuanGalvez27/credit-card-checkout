import { Product } from '../../../domain/models/product';

export interface ProductRepositoryPort {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
}
