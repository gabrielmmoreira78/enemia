import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular usuário logado para demonstração
  useEffect(() => {
    const mockUser = {
      uid: 'demo-user-123',
      email: 'demo@correcaoenem.com',
      displayName: 'Usuário Demonstração'
    };
    
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email, password) => {
    // Simular login
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
      displayName: 'Usuário Demo'
    };
    
    setUser(mockUser);
    return { success: true };
  };

  const signUp = async (email, password, displayName) => {
    // Simular registro
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
      displayName: displayName
    };
    
    setUser(mockUser);
    return { success: true };
  };

  const signInWithGoogle = async () => {
    // Simular login com Google
    const mockUser = {
      uid: 'demo-user-123',
      email: 'demo@gmail.com',
      displayName: 'Usuário Google'
    };
    
    setUser(mockUser);
    return { success: true };
  };

  const signOut = async () => {
    setUser(null);
    return { success: true };
  };

  const value = {
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};




