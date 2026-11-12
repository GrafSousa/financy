'use client';

import { Card } from '@/components/card';
import { ArrowUpDown, Tag, Utensils } from 'lucide-react';

import { CategoryCard } from './category-card';
import { useFetchCategories } from '@/hooks/useCategoryApi';
import { CategoryContentSkeleton } from './category-content-skeleton';

export function CategoryContent() {
  const { categories, isPending } = useFetchCategories();

  if (isPending) {
    return <CategoryContentSkeleton />;
  }

  return (
    <>
      <Card className='h-26.5 gap-4 col-span-4 grid grid-cols-[max-content_1fr] align-top'>
        <Tag width={24} height={24} />

        <div className='flex flex-col'>
          <span className='font-bold leading-8 text-2xl text-gray-800'>
            {categories.length}
          </span>
          <span className='uppercase font-medium text-xs text-gray-500 leading-4'>
            Total de categorias
          </span>
        </div>
      </Card>

      <Card className='h-26.5 gap-4 col-span-4 grid grid-cols-[max-content_1fr] align-top'>
        <ArrowUpDown width={24} height={24} className='text-purple-base' />

        <div className='flex flex-col'>
          <span className='font-bold leading-8 text-2xl text-gray-800'>0</span>
          <span className='uppercase font-medium text-xs text-gray-500 leading-4'>
            Total de transações
          </span>
        </div>
      </Card>

      <Card className='h-26.5 gap-4 col-span-4 grid grid-cols-[max-content_1fr] align-top'>
        <Utensils width={24} height={24} className='text-blue-base' />

        <div className='flex flex-col'>
          <span className='font-bold leading-8 text-2xl text-gray-800'>0</span>
          <span className='uppercase font-medium text-xs text-gray-500 leading-4'>
            Categoria mais utilizada
          </span>
        </div>
      </Card>

      <div className='col-span-12 grid grid-cols-app gap-4'>
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </>
  );
}
