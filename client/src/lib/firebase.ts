// Simple authentication utilities for demo purposes
export const authService = {
  signInWithEmail: async (email: string, password: string) => {
    // Mock authentication - in a real app this would call your backend
    if (email && password) {
      return {
        id: 'demo-user-id',
        email,
        displayName: email.split('@')[0],
        photoURL: undefined,
        firebaseUid: undefined,
      };
    }
    throw new Error('Invalid credentials');
  },
  
  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    // Mock registration - in a real app this would call your backend
    return {
      id: 'demo-user-' + Date.now(),
      email,
      displayName,
      photoURL: undefined,
      firebaseUid: undefined,
    };
  },
  
  signOut: async () => {
    // Mock sign out
    return Promise.resolve();
  }
};
