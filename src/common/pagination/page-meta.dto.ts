import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto.js';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Current page number' })
  readonly page: number;

  @ApiProperty({ description: 'Number of items per page' })
  readonly limit: number;

  @ApiProperty({ description: 'Total number of items found' })
  readonly itemCount: number;

  @ApiProperty({ description: 'Total number of pages' })
  readonly pageCount: number;

  @ApiProperty({ description: 'True if a previous page exists' })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ description: 'True if a next page exists' })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
