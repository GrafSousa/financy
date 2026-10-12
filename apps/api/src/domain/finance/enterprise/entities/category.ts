import { Optional } from '@/core/@types/optional';
import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { normalizeString } from '@financy/utils';

export interface CategoryProps {
  userId: UniqueEntityId;
  name: string;
  description?: string | null;
  icon: string;
  color: string;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class Category extends Entity<CategoryProps> {
  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        name: normalizeString(props.name),
      },
      id,
    );

    return category;
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  set name(name) {
    this.props.name = normalizeString(name);

    this.touch();
  }

  get icon() {
    return this.props.icon;
  }

  set icon(icon) {
    this.props.icon = icon;

    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description) {
    this.props.description = description;

    this.touch();
  }

  get color() {
    return this.props.color;
  }

  set color(color) {
    this.props.color = color;

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
