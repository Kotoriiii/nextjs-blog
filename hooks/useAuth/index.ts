/* eslint-disable no-unused-vars */
import { useGetData } from 'hooks/useRequest';
import { useEffect, useState } from 'react';

type id = number;

interface IAuthFunction {
  (userId: number, callback: (msg: string| null) => void): boolean
}

const useAuth: IAuthFunction = (userId, callback) => {
  const [ isAuth, setIsAuth ] = useState<boolean>(false);
  const { data: id, error } = useGetData<id>({ url: '/api/user/auth' });
  if (error) {
    callback(null);
  }

  useEffect(() => {
    if (id) {
      if (id !== userId) {
        callback('未有权限');
      } else {
        setIsAuth(true);
      }
    }
  }, [id, callback, userId]);

  return isAuth;
};

export default useAuth;
