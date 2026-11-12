import { Tag } from '@/components/tag';
import { Card } from '@/components/card';
import { Category } from '@/models/category';
import { CategoryIcon } from '@/components/category-icon';
import { CategoryDeleteButton } from './category-delete-button';
import { EditCategoryDialog } from './edit-category-dialog';

interface Props {
  category: Category;
}

export function CategoryCard(props: Props) {
  const { category } = props;

  return (
    <Card className='col-span-3 flex flex-col gap-5 min-h-56.5 justify-between'>
      <div className='flex flex-row items-center justify-between'>
        <CategoryIcon name={category.icon} color={category.color} />

        <div className='space-x-2'>
          <CategoryDeleteButton categoryId={category.id} />

          <EditCategoryDialog category={category} />
        </div>
      </div>

      <div className='flex flex-col mb-6.5'>
        <span className='text-base font-semibold leading-6 text-gray-800 capitalize truncate'>
          {category.name}
        </span>
        <span className='h-5 truncate text-gray-600 font-medium text-sm leading-5 capitalize'>
          {category?.description}
        </span>
      </div>

      <div className='flex flex-row items-center justify-between gap-3'>
        <Tag title={category.name} color={category.color} className='min-w-0' />

        <span className='shrink-0 whitespace-nowrap leading-5 text-gray-600 text-sm font-medium'>
          12 items
        </span>
      </div>
    </Card>
  );
}
