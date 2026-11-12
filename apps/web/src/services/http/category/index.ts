import { Category } from '@/models/category';
import { HttpClient } from '../http-client';
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  EditCategoryRequest as BodyEditCategoryRequest,
} from '@financy/contracts';

interface FetchCategoriesResponse {
  categories: Category[];
}

export type EditCategoryRequest = BodyEditCategoryRequest & {
  categoryId: string;
};

export interface CategoryApi {
  fetch(): Promise<FetchCategoriesResponse>;
  delete(request: DeleteCategoryRequest): Promise<void>;
  edit(request: EditCategoryRequest): Promise<Response>;
  create(request: CreateCategoryRequest): Promise<Response>;
}

export class CategoryApiImpl implements CategoryApi {
  private readonly url = 'category';

  constructor(private httpClient: HttpClient) {}

  async fetch(): Promise<FetchCategoriesResponse> {
    return this.httpClient.get(this.url);
  }

  async create(request: CreateCategoryRequest): Promise<Response> {
    return this.httpClient.post(this.url, request);
  }

  delete({ categoryId }: DeleteCategoryRequest): Promise<void> {
    return this.httpClient.delete(`${this.url}/${categoryId}`);
  }

  edit({ categoryId, ...request }: EditCategoryRequest): Promise<Response> {
    return this.httpClient.put(`${this.url}/${categoryId}`, request);
  }
}

let instance: CategoryApi;

export function getCategoryApiInstance(httpClient: HttpClient) {
  if (!instance) {
    instance = new CategoryApiImpl(httpClient);
  }

  return instance;
}
