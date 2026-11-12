import { Card } from '@/components/card';
import { Skeleton } from '@/components/skeleton';

export function CategoryCardSummarySkeleton() {
  return (
    <Card className='h-26.5 gap-4 col-span-4 grid grid-cols-[max-content_1fr] align-top'>
      <Skeleton className='size-6' />

      <div className='flex flex-col gap-2'>
        <Skeleton className='size-6' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </Card>
  );
}
