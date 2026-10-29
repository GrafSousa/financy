import { useApi } from '@/providers/api-provider';
import { AuthenticateUserRequest } from '@financy/contracts';
import { useMutation } from '@tanstack/react-query';

function useAuthApi() {
  const { authApi } = useApi();

  return { authApi };
}

export function useCreateSession() {
  const { authApi } = useAuthApi();

  return useMutation({
    mutationFn: (data: AuthenticateUserRequest) => authApi.createSession(data),
  });
}
