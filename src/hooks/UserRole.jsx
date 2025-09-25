import { useQuery } from '@tanstack/react-query';
import useAuth from './UseAuth';
import axios from 'axios';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: role = 'customer', isLoading: roleLoading, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axios.post('http://localhost:3000/api/users', { email: user.email });

      // Always return something
      return res.data?.data?.role || 'customer'; 
    },
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
