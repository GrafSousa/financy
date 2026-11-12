import Link from 'next/link';
import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const navLinkVariants = tv({
  base: 'leading-5',
  variants: {
    variant: {
      default: 'font-medium text-sm text-gray-600',
      active: 'font-semibold text-brand-base',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type NavLinkVariants = VariantProps<typeof navLinkVariants>;
type NavLinkProps = ComponentProps<typeof Link> & NavLinkVariants;

export function NavLink({ className, variant, ...rest }: NavLinkProps) {
  return <Link className={navLinkVariants({ className, variant })} {...rest} />;
}
