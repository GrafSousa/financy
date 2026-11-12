import { CategoryContent } from './_components/category-content';
import { CreateCategoryDialog } from './_components/create-category-dialog';

export default function CategoriesPage() {
  return (
    <div className='flex-1 gap-6 grid grid-cols-app grid-rows-[max-content_max-content_1fr]'>
      <div className='col-span-12 flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-2xl text-gray-800 leading-8 font-bold'>
            Categorias
          </h1>
          <h2 className='text-gray-600 leading-6 text-base'>
            Organize suas transações por categorias
          </h2>
        </div>

        <CreateCategoryDialog />
      </div>

      <CategoryContent />
    </div>
  );
}
