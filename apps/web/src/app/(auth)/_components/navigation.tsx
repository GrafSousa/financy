'use client';

import { usePathname } from 'next/navigation';
import { NavLink } from './nav-link';

export function Navigation() {
  const pathName = usePathname();

  function isActiveVariant(route: string) {
    return route === pathName ? 'active' : 'default';
  }

  return (
    <nav className='inline-flex items-center gap-5'>
      <NavLink href='/dashboard' variant={isActiveVariant('/dashboard')}>
        Dashboard
      </NavLink>

      <NavLink href='/' variant={isActiveVariant('/')}>
        Transações
      </NavLink>

      <NavLink href='/categories' variant={isActiveVariant('/categories')}>
        Categorias
      </NavLink>
    </nav>
  );
}
