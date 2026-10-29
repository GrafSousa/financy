import { tv, VariantProps } from 'tailwind-variants';

const skeletonVariants = tv({
  base: 'animate-pulse bg-gray-300 pointer-events-none',
  variants: {
    rounded: {
      sm: 'rounded-sm',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    rounded: 'sm',
  },
});

type SkeletonProps = React.ComponentProps<'div'> &
  VariantProps<typeof skeletonVariants>;

export function Skeleton({ className, rounded, ...rest }: SkeletonProps) {
  return <div className={skeletonVariants({ className, rounded })} {...rest} />;
}
