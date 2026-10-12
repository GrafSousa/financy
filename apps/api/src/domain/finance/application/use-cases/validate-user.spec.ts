import { FakeHasher } from '@/infra/test/cryptography/fake-hasher';
import { User } from '../../enterprise/entities/user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { ValidateUserUseCase } from './validate-user';
import { InMemoryUsersRepository } from '@/infra/test/repositories/in-memory-users-repository';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ValidateUserUseCase;

describe('use-case: validate user', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ValidateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to validate a user', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not validate user with invalid password', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '12345678',
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should not validate user with invalid email', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: '1johndoe@test.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
