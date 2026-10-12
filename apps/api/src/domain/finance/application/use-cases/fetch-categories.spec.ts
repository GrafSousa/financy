import { InMemoryCategoriesRepository } from '@/infra/test/repositories/in-memory-categories-repository';
import { FetchCategoriesUseCase } from './fetch-categories';
import { makeUser } from '@/infra/test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeCategory } from '@/infra/test/factories/make-category';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: FetchCategoriesUseCase;

describe('use-case: fetch categories', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoriesUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to fetch categories', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));
    const category = makeCategory({
      userId: user.id,
    });

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCategoriesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
        }),
      ]),
    );

    expect(inMemoryCategoriesRepository.items).toHaveLength(1);
  });

  it('should be able to fetch only user categories', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));
    const user2 = makeUser({}, new UniqueEntityId('2'));

    const category1 = makeCategory({
      userId: user.id,
    });

    const category2 = makeCategory({
      userId: user.id,
    });

    const category3 = makeCategory({
      userId: user2.id,
    });

    inMemoryCategoriesRepository.items.push(category1);
    inMemoryCategoriesRepository.items.push(category2);
    inMemoryCategoriesRepository.items.push(category3);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
        }),
        expect.objectContaining({
          userId: user.id,
        }),
      ]),
    );

    expect(result.value?.categories).toHaveLength(2);
  });
});
