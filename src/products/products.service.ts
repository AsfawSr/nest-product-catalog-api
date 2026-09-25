import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB mechanical keyboard with tactile blue switches',
      price: 89.99,
      category: 'Electronics',
      stock: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Wireless Ergonomic Mouse',
      description: 'Precision wireless mouse with adjustable DPI',
      price: 49.5,
      category: 'Electronics',
      stock: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Ceramic Coffee Mug',
      description: '12oz minimalist ceramic coffee mug',
      price: 15.0,
      category: 'Kitchen',
      stock: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private nextId = 4;

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(query?: QueryProductsDto): Product[] {
    let result = [...this.products];

    if (!query) {
      return result;
    }

    if (query.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === query.category?.toLowerCase(),
      );
    }

    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term),
      );
    }

    if (query.minPrice !== undefined) {
      result = result.filter((p) => p.price >= query.minPrice!);
    }

    if (query.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= query.maxPrice!);
    }

    return result;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const existingProduct = this.products[index];
    const updatedProduct: Product = {
      ...existingProduct,
      ...updateProductDto,
      updatedAt: new Date(),
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number): { message: string; deletedId: number } {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products.splice(index, 1);
    return {
      message: `Product with ID ${id} was successfully deleted`,
      deletedId: id,
    };
  }
}

