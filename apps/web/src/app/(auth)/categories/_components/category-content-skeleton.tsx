import { CategoryCardSkeleton } from './category-card-skeleton';
import { CategoryCardSummarySkeleton } from './category-card-summary-skeleton';

export function CategoryContentSkeleton() {
  return (
    <>
      {Array.from(
        [1, 2, 3].map((item) => <CategoryCardSummarySkeleton key={item} />),
      )}

      {Array.from(
        [1, 2, 3, 4].map((item) => <CategoryCardSkeleton key={item} />),
      )}
    </>
  );
}
