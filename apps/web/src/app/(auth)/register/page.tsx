import Link from 'next/link';
import { AuthCard } from '../_components/auth-card';
import { buttonVariants } from '@/components/button';
import { LogIn } from 'lucide-react';
import { RegisterForm } from './form';

export default function RegisterPage() {
  return (
    <AuthCard.Root>
      <AuthCard.Header
        title='Criar conta'
        description='Comece a controlar suas finanças ainda hoje'
      />

      <RegisterForm />

      <AuthCard.Footer>
        <span className='text-gray-600 leading-5 font-normal text-sans text-sm'>
          Já tem uma conta?
        </span>

        <Link
          href='/sign-in'
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <LogIn />
          Fazer login
        </Link>
      </AuthCard.Footer>
    </AuthCard.Root>
  );
}
