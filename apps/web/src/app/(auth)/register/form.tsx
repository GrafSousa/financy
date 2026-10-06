'use client';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeClosed,
  LoaderCircle,
  Lock,
  Mail,
  UserRound,
} from 'lucide-react';
import { Form as BaseForm } from '@base-ui/react/form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/input';
import { Button } from '@/components/button';

import { useCreateAccount } from '@/hooks/useAccountsApi';
import { CreateAccountRequest, createAccountSchema } from '@financy/contracts';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useCreateAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAccountSchema),
  });

  async function onSubmit(data: CreateAccountRequest) {
    mutate(data, {
      onSuccess: () => {
        toast.success('Usuário criado com sucesso.');
        router.push('/sign-in');
      },
      onError: (response) => {
        console.error(response);

        toast.error(
          'Não foi possível concluir o cadastro. Verifique os dados ou tente acessar sua conta.',
        );
      },
    });
  }

  return (
    <BaseForm
      id='create-account-form'
      onSubmit={handleSubmit(onSubmit)}
      className='col-span-4 w-full space-y-4'
    >
      <Input.Root>
        <Input.Label>Nome completo</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <UserRound size={16} />
          </Input.Prefix>
          <Input.Control
            placeholder='Seu nome completo'
            {...register('name')}
          />
        </Input.Content>
        {errors.name && (
          <Input.HelperText className='text-feedback-danger'>
            Campo obrigatório
          </Input.HelperText>
        )}
      </Input.Root>

      <Input.Root>
        <Input.Label>E-mail</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <Mail size={16} />
          </Input.Prefix>
          <Input.Control
            placeholder='mail@exemplo.com'
            {...register('email')}
          />
        </Input.Content>
        {errors.email && (
          <Input.HelperText className='text-feedback-danger'>
            Campo obrigatório
          </Input.HelperText>
        )}
      </Input.Root>

      <Input.Root>
        <Input.Label>Senha</Input.Label>
        <Input.Content>
          <Input.Prefix>
            <Lock size={16} />
          </Input.Prefix>
          <Input.Control
            placeholder='Digite sua senha'
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
          />
          <Input.Suffix
            className='cursor-pointer transition-all p-1 rounded-full hover:bg-gray-200/50  '
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
          </Input.Suffix>
        </Input.Content>

        {errors.password && (
          <Input.HelperText className='text-feedback-danger'>
            A senha deve ter no mínimo 8 caracteres
          </Input.HelperText>
        )}
      </Input.Root>

      <Button type='submit' form='create-account-form' disabled={isPending}>
        {isPending ? (
          <>
            <span>Carregando...</span>
            <LoaderCircle size={16} className='animate-spin' />
          </>
        ) : (
          'Cadastrar'
        )}
      </Button>
    </BaseForm>
  );
}
