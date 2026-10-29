import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { tv, VariantProps } from 'tailwind-variants';

const categoryIconVariants = tv({
  base: 'size-10 rounded-lg flex items-center justify-center',
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

type CategoryIconVariants = VariantProps<typeof categoryIconVariants>;

type CategoryIconProps = CategoryIconVariants & {
  name: IconName;
};

export function CategoryIcon({ color, name, ...rest }: CategoryIconProps) {
  return (
    <div className={categoryIconVariants({ color })}>
      <DynamicIcon name={name} size={16} {...rest} />
    </div>
  );
}
