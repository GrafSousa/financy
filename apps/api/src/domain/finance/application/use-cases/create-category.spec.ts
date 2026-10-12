import { InMemoryUsersRepository } from '@/infra/test/repositories/in-memory-users-repository';
import { CreateCategoryUseCase } from './create-category';
import { InMemoryCategoriesRepository } from '@/infra/test/repositories/in-memory-categories-repository';
import { makeUser } from '@/infra/test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeCategory } from '@/infra/test/factories/make-category';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateCategoryUseCase;

describe('use-case: create category', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryUseCase(
      inMemoryUsersRepository,
      inMemoryCategoriesRepository,
    );
  });

  it('should be able to create an category', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      name: 'test category',
      color: '#7159c1',
      icon: 'eye-icon',
      userId: user.id.toString(),
      description: 'test-description',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      category: inMemoryCategoriesRepository.items[0],
    });
  });

  it('should be able to create with the same name, but for different users', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));

    inMemoryUsersRepository.items.push(user);

    const category = makeCategory({
      name: 'category-test',
      userId: new UniqueEntityId('2'),
    });

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      name: 'category-test',
      color: '#7159c1',
      icon: 'eye-icon',
      userId: user.id.toString(),
      description: 'test-description',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      category: inMemoryCategoriesRepository.items[1],
    });
  });

  it('should not be able to create an category with inexistent user', async () => {
    const result = await sut.execute({
      name: 'test category',
      color: '#7159c1',
      icon: 'eye-icon',
      userId: '1',
      description: 'test-description',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create an category with the same name for the same user', async () => {
    const user = makeUser({}, new UniqueEntityId('1'));

    inMemoryUsersRepository.items.push(user);

    const category = makeCategory({ name: 'category-test', userId: user.id });

    inMemoryCategoriesRepository.items.push(category);

    const result = await sut.execute({
      name: 'category-test',
      color: '#7159c1',
      icon: 'eye-icon',
      userId: user.id.toString(),
      description: 'test-description',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError);
  });
});
