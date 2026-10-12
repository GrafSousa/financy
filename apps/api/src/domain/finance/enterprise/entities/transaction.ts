import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface TransactionProps {
  userId: UniqueEntityId;
  accountId: UniqueEntityId;
  categoryId: UniqueEntityId;

  description: string;
  type: 'INCOME' | 'EXPENSE';
  value: number;

  createdAt: Date;
  occurredAt: Date;
  updatedAt?: Date | null;
}

export class Transaction extends Entity<TransactionProps> {
  static create(props: TransactionProps, id?: UniqueEntityId) {
    const transaction = new Transaction(props, id);

    return transaction;
  }

  get userId() {
    return this.props.userId;
  }

  get accountId() {
    return this.props.accountId;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get description() {
    return this.props.description;
  }

  set description(description) {
    this.props.description = description;

    this.touch();
  }

  get type() {
    return this.props.type;
  }

  set type(type) {
    this.props.type = type;

    this.touch();
  }

  get value() {
    return this.props.value;
  }

  set value(value) {
    this.props.value = value;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get occurredAt() {
    return this.props.occurredAt;
  }

  set occurredAt(occurredAt) {
    this.props.occurredAt = occurredAt;

    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
