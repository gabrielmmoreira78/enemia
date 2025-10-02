// Mock do Firebase para testes sem configuração real
export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: async () => ({ user: { uid: 'mock-user', email: 'test@test.com' } }),
  createUserWithEmailAndPassword: async () => ({ user: { uid: 'mock-user', email: 'test@test.com' } }),
  signInWithPopup: async () => ({ user: { uid: 'mock-user', email: 'test@test.com' } }),
  signOut: async () => ({}),
  onAuthStateChanged: (callback) => {
    // Simular usuário logado
    setTimeout(() => callback({ uid: 'mock-user', email: 'test@test.com', displayName: 'Usuário Teste' }), 100);
    return () => {};
  }
};

export const db = {
  collection: (name) => ({
    add: async (data) => ({ id: 'mock-doc-id' }),
    doc: (id) => ({
      get: async () => ({ exists: () => true, data: () => ({}) })
    }),
    where: () => ({
      orderBy: () => ({
        onSnapshot: (callback) => {
          callback({ docs: [] });
          return () => {};
        }
      })
    })
  })
};

export const storage = {};

export default {};




