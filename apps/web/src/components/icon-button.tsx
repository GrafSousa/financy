import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const iconButtonVariants = tv({
  slots: {
    button: [
      'group p-2 inline-flex items-center justify-center bg-transparent transition-all',
      'text-gray-700 cursor-pointer hover:bg-gray-200',
      'disabled:cursor-not-allowed disabled:bg-white/50 disabled:text-gray-700/50',
    ],
    icon: '',
  },
  variants: {
    variant: {
      outline: {
        button: 'border border-gray-300',
      },
    },
    size: {
      md: { button: 'size-8', icon: 'size-4' },
    },
    rounded: {
      lg: { button: 'rounded-lg' },
    },
    state: {
      error: {
        button: 'text-feedback-danger disabled:text-feedback-danger/50',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    rounded: 'lg',
  },
});

type IconButtonVariants = VariantProps<typeof iconButtonVariants>;

type IconButtonProps = React.ComponentProps<'button'> &
  IconButtonVariants & {
    icon: React.ElementType;
  };

export function IconButton(props: IconButtonProps) {
  const {
    size,
    state,
    variant,
    rounded,
    className,
    icon: Icon,
    ...rest
  } = props;

  const { button, icon } = iconButtonVariants({
    variant,
    size,
    rounded,
    state,
    className,
  });

  return (
    <button className={button()} {...rest}>
      <Icon className={icon()} />
    </button>
  );
}
