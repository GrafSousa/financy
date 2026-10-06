import { useApi } from '@/providers/api-provider';
import { CreateAccountRequest } from '@financy/contracts';
import { useMutation } from '@tanstack/react-query';

function useAccountApi() {
  const { accountApi } = useApi();

  return { accountApi };
}

export function useCreateAccount() {
  const { accountApi } = useAccountApi();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountApi.create(data),
  });
}
