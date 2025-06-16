import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || '',
  usuario: JSON.parse(localStorage.getItem('usuario')) || null,

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  setUsuario: (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    set({ usuario });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    set({ token: '', usuario: null });
  }
}));

export default useAuthStore;
