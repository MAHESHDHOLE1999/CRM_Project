import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import './i18n/config';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Items from './pages/Items';
import Bookings from './pages/Bookings';
import Reports from './pages/Reports';
import Layout from './components/layout/Layout';
import Users from './pages/Users';

const queryClient = new QueryClient();

// function PrivateRoute({ children }) {
//   const { token } = useAuthStore();
//   return token ? children : <Navigate to="/login" />;
// }

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const App = () => {
  const { theme } = useThemeStore();
  // const { setUser, logout } = useAuthStore();
  const hydrate = useAuthStore((state)=> state.hydrate);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // useEffect(() => {
  //   const restoreSession = async () => {
  //     try {
  //       const res = await api.get('/auth/me');
  //       setUser(res.data.data.user);
  //     } catch (err) {
  //       logout();
  //     }
  //   };

  //   restoreSession();
  // }, []);

  useEffect(()=>{
    hydrate();
  },[]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/users" element={<Users />} />

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App