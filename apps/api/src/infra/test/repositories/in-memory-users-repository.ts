import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UsersRepository } from '@/domain/finance/application/repositories/users-repository';
import { User } from '@/domain/finance/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) =>
      user.id.equals(new UniqueEntityId(id)),
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
