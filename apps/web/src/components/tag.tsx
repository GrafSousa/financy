import { tv, VariantProps } from 'tailwind-variants';

const tagVariants = tv({
  base: [
    'px-3 py-1 h-7 rounded-full flex items-center justify-center',
    'font-medium leading-5 text-sm',
  ],
  variants: {
    color: {
      'green-base': 'bg-green-light text-green-base',
      'blue-base': 'bg-blue-light text-blue-base',
      'purple-base': 'bg-purple-light text-purple-base',
      'pink-base': 'bg-pink-light text-pink-base',
      'red-base': 'bg-red-light text-red-base',
      'orange-base': 'bg-orange-light text-orange-base',
      'yellow-base': 'bg-yellow-light text-yellow-base',
    },
  },
});

type TagVariants = VariantProps<typeof tagVariants>;

type TagProps = TagVariants &
  React.ComponentProps<'div'> & {
    title: string;
  };

export function Tag({ title, color, className, ...rest }: TagProps) {
  return (
    <div className={tagVariants({ color, className })} {...rest}>
      <span className='truncate'>{title}</span>
    </div>
  );
}
