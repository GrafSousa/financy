import { DeleteCategoryUseCase } from './delete-category';
import { InMemoryCategoriesRepository } from '@/infra/test/repositories/in-memory-categories-repository';
import { makeUser } from '@/infra/test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeCategory } from '@/infra/test/factories/make-category';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: DeleteCategoryUseCase;

describe('use-case: delete category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to delete an category', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));

    const category = makeCategory(
      {
        userId: user.id,
      },
      new UniqueEntityId('1'),
    );

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      categoryId: category.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCategoriesRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an inexistent category', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));

    const category = makeCategory(
      {
        name: 'category-test',
        userId: user.id,
      },
      new UniqueEntityId('1'),
    );

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      categoryId: '2',
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete an category from another user', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));

    const category = makeCategory(
      {
        userId: user.id,
      },
      new UniqueEntityId('1'),
    );

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      categoryId: category.id.toString(),
      userId: '2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
