'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { SquarePen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form as BaseForm } from '@base-ui/react/form';
import { EditCategoryRequest, editCategorySchema } from '@financy/contracts';

import { Dialog } from '@/components/dialog';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { CategoryIconPicker } from './category-icon-picker';
import { CategoryColorPicker } from './category-color-picker';
import { useEditCategory } from '@/hooks/useCategoryApi';
import { Category } from '@/models/category';

interface EditCategoryDialogProps {
  category: Category;
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useEditCategory();
  const queryClient = useQueryClient();

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      color: category.color,
      description: category?.description || '',
      icon: category.icon,
      name: category.name,
    },
    resolver: zodResolver(editCategorySchema),
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      reset({
        color: category.color,
        description: category?.description || '',
        icon: category.icon,
        name: category.name,
      });
    }
  }

  async function onSubmit(data: EditCategoryRequest) {
    mutate(
      {
        categoryId: category.id,
        ...data,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['categories'],
          });

          toast.success('Categoria editada com sucesso!');

          handleOpenChange(false);
        },
        onError: (response) => {
          console.error(response);

          toast.error(
            'Não foi possível editar a categoria. Verifique os dados ou tente novamente mais tarde.',
          );
        },
      },
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger variant='outline' className='w-fit p-2 size-8'>
        <SquarePen className='size-4' />
      </Dialog.Trigger>

      <Dialog.Content className='max-w-md'>
        <header className='flex flex-row items-start justify-between gap-4 mb-6'>
          <div className='min-w-0 flex-1 space-y-1'>
            <Dialog.Title>Nova categoria</Dialog.Title>
            <Dialog.Description className='truncate'>
              Organize suas transações com categorias
            </Dialog.Description>
          </div>

          <Dialog.Close />
        </header>

        <BaseForm
          id='edit-category-form'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <Input.Root>
            <Input.Label>Título</Input.Label>
            <Input.Content>
              <Input.Control
                placeholder='Ex: Alimentação'
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
            <Input.Label>Descrição</Input.Label>
            <Input.Content>
              <Input.Control
                placeholder='Descrição da categoria'
                {...register('description')}
              />
            </Input.Content>
          </Input.Root>

          <Controller
            name='icon'
            control={control}
            render={({ field }) => (
              <div>
                <CategoryIconPicker
                  name={field.name}
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
                {errors.icon && (
                  <span className='mt-2 text-feedback-danger text-xs leading-4'>
                    Campo obrigatório
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name='color'
            control={control}
            render={({ field }) => (
              <div>
                <CategoryColorPicker
                  name={field.name}
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
                {errors.color && (
                  <span className='mt-2 text-feedback-danger text-xs leading-4'>
                    Campo obrigatório
                  </span>
                )}
              </div>
            )}
          />

          <Button type='submit' form='edit-category-form' className='mt-2'>
            Salvar
          </Button>
        </BaseForm>
      </Dialog.Content>
    </Dialog.Root>
  );
}
