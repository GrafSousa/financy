'use client';
import { Lock, Mail, UserRound } from 'lucide-react';
import { Form as BaseForm } from '@base-ui/react/form';

import { Input } from '@/components/input';
import { Button } from '@/components/button';

export function RegisterForm() {
  return (
    <BaseForm className='col-span-4 w-full space-y-4'>
      <Input.Root>
        <Input.Label>Nome completo</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <UserRound />
          </Input.Prefix>
          <Input.Control placeholder='Seu nome completo' />
        </Input.Content>
      </Input.Root>

      <Input.Root>
        <Input.Label>E-mail</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <Mail />
          </Input.Prefix>
          <Input.Control placeholder='mail@exemplo.com' />
        </Input.Content>
      </Input.Root>

      <Input.Root>
        <Input.Label>Senha</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <Lock />
          </Input.Prefix>
          <Input.Control placeholder='Digite sua senha' />
        </Input.Content>
        <Input.HelperText>
          A senha deve ter no mínimo 8 caracteres
        </Input.HelperText>
      </Input.Root>

      <Button>Cadastrar</Button>
    </BaseForm>
  );
}
