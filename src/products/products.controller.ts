import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { ProductOutputDto } from './application/dtos/product-output.dto.js';
import { PageDto } from '../common/pagination/page.dto.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case.js';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../auth/enums/user-role.enum.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductOutputDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or domain business invariant violated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: missing or invalid JWT Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: requires ADMIN role.',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve, filter, and paginate products (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of products matching criteria.',
    type: PageDto<ProductOutputDto>,
  })
  findAll(@Query() query: QueryProductsDto) {
    return this.getProductsUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID (Public)' })
  @ApiParam({ name: 'id', description: 'Numeric product ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Product found.',
    type: ProductOutputDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getProductByIdUseCase.execute(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Numeric product ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
    type: ProductOutputDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation or domain rule error.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: missing or invalid JWT Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: requires ADMIN role.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Numeric product ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: missing or invalid JWT Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: requires ADMIN role.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteProductUseCase.execute(id);
  }
}
