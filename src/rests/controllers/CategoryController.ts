import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '@Services/CategoryService';
import { CreateCategoryRequest } from '@Rests/types/CreateCategoryRequest';
import { CreateCategoryResponse } from '@Rests/types/CreateCategoryRespone';
import { CreateCategoryInput } from '@Services/types/CreateCategoryInput';
import { UpdateCategoryRequest } from '@Rests/types/UpdateCategoryRequest';
import { UpdateCategoryInput } from '@Services/types/UpdateCategoryInput';
import { UpdateCategoryResponse } from '@Rests/types/UpdateCategoryRespone';

@Service()
@JsonController('/category')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class CategoryController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly CateService: CategoryService
  ) {}

  @Post('/')
  async create(@Body() body: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const input: CreateCategoryInput = { ...body };
    const result = await this.CateService.CreateCate(input);
    return plainToInstance(CreateCategoryResponse, result, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('categoryName') categoryName?: string) {
    const result = await this.CateService.search({ categoryName });
    return result.map(dm =>
      plainToInstance(CreateCategoryResponse, dm, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.CateService.getById(params.id);
    return plainToInstance(CreateCategoryResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateCategoryRequest
  ) {
    const input: UpdateCategoryInput = { CategoryId: params.id, ...req };
    const cate = await this.CateService.partialUpdate(input);
    return plainToInstance(UpdateCategoryResponse, cate, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.CateService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.CateService.inactivateCategory(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.CateService.restore(id);
  
  }
}
