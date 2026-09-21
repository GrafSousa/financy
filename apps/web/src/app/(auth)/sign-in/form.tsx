'use client';
import { Form as BaseForm } from '@base-ui/react/form';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { EyeClosed, Lock, Mail } from 'lucide-react';

export function SignInForm() {
  return (
    <BaseForm className='col-span-4 w-full space-y-4'>
      <Input.Root>
        <Input.Label>E-mail</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <Mail size={16} />
          </Input.Prefix>
          <Input.Control placeholder='mail@exemplo.com' />
        </Input.Content>
      </Input.Root>

      <Input.Root>
        <Input.Label>Senha</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <Lock size={16} />
          </Input.Prefix>
          <Input.Control type='password' placeholder='Digite sua senha' />

          <Input.Suffix>
            <button
              type='button'
              className='px-1 py-1 rounded-lg outline-none flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-brand-dark/70'
            >
              <EyeClosed size={16} />
            </button>
          </Input.Suffix>
        </Input.Content>
      </Input.Root>

      <Button>Entrar</Button>
    </BaseForm>
  );
}
