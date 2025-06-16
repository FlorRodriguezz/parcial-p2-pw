import { create } from 'zustand';

const useCartStore = create((set) => ({
  carrito: [],
  
  agregarAlCarrito: (producto, cantidad) =>
    set((state) => {
      const index = state.carrito.findIndex(p => p._id === producto._id);
      if (index === -1) {
        return { carrito: [...state.carrito, { ...producto, cantidad }] };
      } else {
        const item = state.carrito[index];
        const nuevaCantidad = item.cantidad + cantidad;
        if (nuevaCantidad > producto.stock) {
          alert(`Solo hay ${producto.stock} unidades disponibles`);
          return state;
        }
        const actualizado = [...state.carrito];
        actualizado[index] = { ...item, cantidad: nuevaCantidad };
        return { carrito: actualizado };
      }
    }),

  actualizarCantidad: (id, nuevaCantidad) =>
    set((state) => {
      const index = state.carrito.findIndex(p => p._id === id);
      if (index === -1) return state;
      const actualizado = [...state.carrito];
      actualizado[index] = { ...actualizado[index], cantidad: nuevaCantidad };
      return { carrito: actualizado };
    }),

  eliminarDelCarrito: (id) =>
    set((state) => ({
      carrito: state.carrito.filter(p => p._id !== id),
    })),

  limpiarCarrito: () => set({ carrito: [] }),
}));

export default useCartStore;


