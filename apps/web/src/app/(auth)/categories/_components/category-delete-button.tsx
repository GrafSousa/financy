'use client';

import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { IconButton } from '@/components/icon-button';
import { useDeleteCategory } from '@/hooks/useCategoryApi';

interface CategoryDeleteButtonProps {
  categoryId: string;
}

export function CategoryDeleteButton({
  categoryId,
}: CategoryDeleteButtonProps) {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteCategory();

  function handleDeleteCategory() {
    mutate(
      { categoryId },
      {
        onSuccess: () => {
          toast.success('Categoria deletada com sucesso!');

          queryClient.invalidateQueries({
            queryKey: ['categories'],
          });
        },
        onError: (response) => {
          console.error(response);

          toast.error(
            'Não foi possível deletar a categoria. Tente novamente mais tarde.',
          );
        },
      },
    );
  }

  return (
    <IconButton
      icon={Trash}
      className='text-feedback-danger  focus-within:ring-feedback-danger/70'
      onClick={handleDeleteCategory}
    />
  );
}
