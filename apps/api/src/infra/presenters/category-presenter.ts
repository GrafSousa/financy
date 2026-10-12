import { Category } from '@/domain/finance/enterprise/entities/category';

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return {
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
    };
  }
}
