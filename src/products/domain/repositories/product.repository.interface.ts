import { Product } from '../models/product.model.js';

export interface ProductFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  skip?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  sortBy?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export const PRODUCT_REPOSITORY_TOKEN = 'PRODUCT_REPOSITORY';

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(filter?: ProductFilter): Promise<PaginatedResult<Product>>;
  delete(id: number): Promise<boolean>;
}
