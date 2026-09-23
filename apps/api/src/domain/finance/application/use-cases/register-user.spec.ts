import { InMemoryUsersRepository } from '@/infra/test/repositories/in-memory-users-repository';
import { RegisterUserUseCase } from './register-user';
import { FakeHasher } from '@/infra/test/cryptography/fake-hasher';
import { User } from '../../enterprise/entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe('use-case: register user', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });

  it('should not be able to register a user with the same email twice', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
