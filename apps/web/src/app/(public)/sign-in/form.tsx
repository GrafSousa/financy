'use client';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Form as BaseForm } from '@base-ui/react/form';
import { Eye, EyeClosed, LoaderCircle, Lock, Mail } from 'lucide-react';
import {
  AuthenticateUserRequest,
  authenticateUserSchema,
} from '@financy/contracts';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSession } from '@/hooks/useAuthApi';

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useCreateSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authenticateUserSchema),
  });

  async function onSubmit(data: AuthenticateUserRequest) {
    mutate(data, {
      onSuccess: () => {
        router.replace('/dashboard');
      },
      onError: (response) => {
        console.error(response);

        toast.error(
          'Não foi possível realizar o login. Verifique os dados ou tente novamente mais tarde.',
        );
      },
    });
  }

  return (
    <BaseForm
      className='col-span-4 w-full space-y-4'
      id='sign-in-form'
      onSubmit={handleSubmit(onSubmit)}
    >
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
            type={showPassword ? 'text' : 'password'}
            placeholder='Digite sua senha'
            {...register('password')}
          />

          <Input.Suffix>
            <button
              type='button'
              className='px-1 py-1 rounded-lg outline-none flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-brand-dark/70'
              onClick={() => setShowPassword((state) => !state)}
            >
              {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
            </button>
          </Input.Suffix>
        </Input.Content>

        {errors.password && (
          <Input.HelperText className='text-feedback-danger'>
            A senha deve ter no mínimo 8 caracteres
          </Input.HelperText>
        )}
      </Input.Root>

      <Button type='submit' form='sign-in-form' disabled={isPending}>
        {isPending ? (
          <>
            <span>Carregando...</span>
            <LoaderCircle size={16} className='animate-spin' />
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </BaseForm>
  );
}
