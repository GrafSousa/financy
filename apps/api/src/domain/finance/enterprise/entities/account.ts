import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface AccountProps {
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt?: Date | null;
  userId: UniqueEntityId;
}

export class Account extends Entity<AccountProps> {
  static create(props: AccountProps, id?: UniqueEntityId) {
    const account = new Account(props, id);

    return account;
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get balance() {
    return this.props.balance;
  }

  set balance(balance: number) {
    this.props.balance = balance;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
