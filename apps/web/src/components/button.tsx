import { tv, VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
  base: [
    'w-full items-center justify-center inline-flex whitespace-nowrap rounded-lg cursor-pointer gap-2',
    'whitespace-nowrap font-medium leading-6 font-sans',
    'transition-all outline-none shadow-sm shadow-gray-200',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // 'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
  ],
  variants: {
    variant: {
      solid: [
        'bg-brand-base text-white hover:bg-brand-dark',
        'focus-within:ring-2 focus-visible:ring-brand-dark/70',
      ],
      outline: [
        'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-200',
        'focus-within:ring-2 focus-visible:ring-gray-400/50',
      ],
    },
    size: {
      md: 'text-base px-4 py-3',
      sm: 'text-sm px-3 py-2',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ComponentProps<'button'> & ButtonVariants;

export function Button(props: ButtonProps) {
  const { variant, size, className, type = 'button', ...rest } = props;

  return (
    <button
      data-slot='button'
      type={type}
      className={buttonVariants({
        size,
        variant,
        className,
      })}
      {...rest}
    />
  );
}
