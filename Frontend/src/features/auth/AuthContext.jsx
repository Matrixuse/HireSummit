import { createContext, useEffect, useState } from 'react';
import { getMe } from './services/auth.api.js';

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const data = await getMe();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </authContext.Provider>
  )
}