import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

// export const useAuthStore = create(
//   persist(
//     (set)=>({
//       user: null,
//       isAuthenticated: false,

//       setUser: (user)=>
//         set({
//           user,
//           isAuthenticated: true
//         }),
//       logout: async()=>{
//         try {
//           await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`,{
//             method: 'POST',
//             credentials: 'include'
//           });
//         } catch (error) {
//           console.error('Logout error',error);
//         }
//         set({
//           user: null,
//           isAuthenticated: false
//         });
//       }
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state)=> ({user: state})
//     }
//   )
// );

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // ✅ Called after login OR /auth/me
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      // ✅ VERY IMPORTANT: session rehydration
      hydrate: async () => {
        try {
          const res = await api.get('/auth/me'); // cookie sent automatically
          set({
            user: res.data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error', error);
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',

      // ✅ Persist ONLY user (never persist auth flags)
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);