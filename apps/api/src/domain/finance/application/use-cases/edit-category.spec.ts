import { InMemoryCategoriesRepository } from '@/infra/test/repositories/in-memory-categories-repository';
import { EditCategoryUseCase } from './edit-category';
import { makeUser } from '@/infra/test/factories/make-user';
import { makeCategory } from '@/infra/test/factories/make-category';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: EditCategoryUseCase;

describe('use-case: edit category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new EditCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to edit an category', async () => {
    const user = makeUser();
    const category = makeCategory({
      userId: user.id,
    });

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      id: category.id.toString(),
      userId: user.id.toString(),
      color: 'color-test',
      description: 'description-test',
      icon: 'icon-test',
      name: 'name-test',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      color: 'color-test',
      description: 'description-test',
      icon: 'icon-test',
      name: 'name-test',
    });
  });

  it('should not be able to edit an inexistent category', async () => {
    const user = makeUser();
    const category = makeCategory(
      {
        userId: user.id,
      },
      new UniqueEntityId('1'),
    );

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      id: '2',
      userId: user.id.toString(),
      color: 'color-test',
      description: 'description-test',
      icon: 'icon-test',
      name: 'name-test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit an category from another user', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));
    const category = makeCategory(
      {
        userId: user.id,
      },
      new UniqueEntityId('1'),
    );

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      id: category.id.toString(),
      userId: '2',
      color: 'color-test',
      description: 'description-test',
      icon: 'icon-test',
      name: 'name-test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit an category with same name', async () => {
    const user = makeUser();
    const category = makeCategory({
      name: 'category-test',
      userId: user.id,
    });

    const category2 = makeCategory({
      name: 'category-test-2',
      userId: user.id,
    });

    inMemoryCategoriesRepository.items.push(category);
    inMemoryCategoriesRepository.items.push(category2);

    const result = await sut.execute({
      id: category.id.toString(),
      userId: user.id.toString(),
      name: 'category-test-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError);
  });
});
