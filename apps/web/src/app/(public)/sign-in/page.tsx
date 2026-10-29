import Link from 'next/link';
import { UserRoundPlus } from 'lucide-react';

import { SignInForm } from './form';
import { AuthCard } from '../_components/auth-card';
import { buttonVariants } from '@/components/button';

export default function SignInPage() {
  return (
    <AuthCard.Root>
      <AuthCard.Header
        title='Fazer login'
        description='Entre na sua conta para continuar'
      />

      <SignInForm />

      <AuthCard.Footer>
        <span className='text-gray-600 leading-5 font-normal text-sans text-sm'>
          Ainda não tem conta
        </span>

        <Link
          href='/register'
          className={buttonVariants({
            variant: 'outline',
            className: 'col-span-4',
          })}
        >
          <UserRoundPlus />
          Criar conta
        </Link>
      </AuthCard.Footer>
    </AuthCard.Root>
  );
}
