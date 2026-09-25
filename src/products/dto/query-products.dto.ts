import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../common/pagination/page-options.dto.js';

export class QueryProductsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    example: 'Audio',
    description: 'Filter products by category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'Headphones',
    description: 'Search term for name and description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Minimum price filter',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    example: 500,
    description: 'Maximum price filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  maxPrice?: number;
}
