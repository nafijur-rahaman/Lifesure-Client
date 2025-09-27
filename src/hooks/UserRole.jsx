import { useQuery } from '@tanstack/react-query';
import useAuth from './UseAuth';
import axios from 'axios';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: role = 'customer', isLoading: roleLoading, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email, // only call API if user exists
    queryFn: async () => {
      try {
        const res = await axios.post('http://localhost:3000/api/user-info', { email: user.email });
        return res.data?.data?.role || 'customer';
      } catch {
        return 'customer';
      }
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
