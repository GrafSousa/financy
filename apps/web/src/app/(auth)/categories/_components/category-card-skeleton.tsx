import { Card } from '@/components/card';
import { Skeleton } from '@/components/skeleton';

export function CategoryCardSkeleton() {
  return (
    <Card className='col-span-3 flex flex-col gap-5 h-fit'>
      <div className='flex flex-row items-center justify-between'>
        <Skeleton className='p-3' rounded='lg' />

        <div className='flex flex-row gap-2'>
          <Skeleton className='size-8' rounded='lg' />
          <Skeleton className='size-8' rounded='lg' />
        </div>
      </div>

      <div className='flex flex-col gap-1 mb-6.5'>
        <Skeleton className='w-1/2 h-4' />
        <Skeleton className='w-full h-3' />
      </div>

      <div className='flex flex-row items-center justify-between'>
        <Skeleton className='w-1/4 h-4' />
        <Skeleton className='w-1/3 h-3' />
      </div>
    </Card>
  );
}
