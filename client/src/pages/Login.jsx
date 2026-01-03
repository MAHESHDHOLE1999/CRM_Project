// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { toast } from 'sonner';
// import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import api from '@/services/api';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters')
// });

// const registerSchema = z.object({
//   username: z.string().min(3, 'Username must be at least 3 characters'),
//   email: z.string().email('Invalid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string()
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// export default function Login() {
//   const navigate = useNavigate();
//   // const { setAuth } = useAuthStore();
//   const { setUser } = useAuthStore();
//   const [activeTab, setActiveTab] = useState('login');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState({ login: false, register: false });
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const loginForm = useForm({
//     resolver: zodResolver(loginSchema)
//   });

//   const registerForm = useForm({
//     resolver: zodResolver(registerSchema)
//   });

//   const onLogin = async (data) => {
//     try {
//       setLoading(true);
//       const response = await api.post('/auth/login', data);
//       // const { user, token } = response.data.data;
//       const { user } = response.data.data;
//       setUser(user);
//       setSubmitSuccess(true);
//       toast.success('Login successful!');
//       setTimeout(() => navigate('/'), 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRegister = async (data) => {
//     try {
//       setLoading(true);
//       const { confirmPassword, ...registerData } = data;
//       const response = await api.post('/auth/register', registerData);
//       // const { user, token } = response.data.data;
//       const { user } = response.data.data;
//       // setAuth(user, token);
//       setUser(user);
//       setSubmitSuccess(true);
//       toast.success('Registration successful!');
//       setTimeout(() => navigate('/'), 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
//       <style>{`
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slide-in { animation: slideIn 0.5s ease-out; }
//       `}</style>

//       <div className="w-full max-w-md animate-slide-in">
//         {/* Success Message */}
//         {submitSuccess && (
//           <div className="fixed top-4 right-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3 animate-slide-in z-50 shadow-lg">
//             <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
//             <span className="font-semibold text-green-800 dark:text-green-300">Success! Welcome to Ajay Gadhi CRM</span>
//           </div>
//         )}

//         {/* Header with Logo */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg mb-5">
//             <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ajay Gadhi Bandar</h1>
//           <p className="text-slate-600 dark:text-slate-400">CRM Platform</p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
//           {/* Tab Navigation */}
//           <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 gap-2">
//             <button
//               onClick={() => setActiveTab('login')}
//               className={`flex-1 py-2.5 px-4 font-semibold text-sm rounded-lg transition-all duration-300 ${
//                 activeTab === 'login'
//                   ? 'bg-slate-900 dark:bg-slate-700 text-white'
//                   : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => setActiveTab('register')}
//               className={`flex-1 py-2.5 px-4 font-semibold text-sm rounded-lg transition-all duration-300 ${
//                 activeTab === 'register'
//                   ? 'bg-slate-900 dark:bg-slate-700 text-white'
//                   : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
//               }`}
//             >
//               Create Account
//             </button>
//           </div>

//           {/* Content Container */}
//           <div className="p-8">
            
//             {/* Login Form */}
//             {activeTab === 'login' && (
//               <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6 animate-slide-in">
                
//                 {/* Email Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
//                     <input
//                       type="email"
//                       placeholder="your@email.com"
//                       {...loginForm.register('email')}
//                       className="w-full bg-white dark:bg-slate-800 dark:border-0 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-transparent dark:focus:ring-0 transition-all"
//                     />
//                   </div>
//                   {loginForm.formState.errors.email && (
//                     <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                       <span>●</span> {loginForm.formState.errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
//                     <input
//                       type={showPassword.login ? 'text' : 'password'}
//                       placeholder="Enter your password"
//                       {...loginForm.register('password')}
//                       className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
//                       className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
//                     >
//                       {showPassword.login ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                   {loginForm.formState.errors.password && (
//                     <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                       <span>●</span> {loginForm.formState.errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Remember & Forgot */}
//                 <div className="flex items-center justify-between text-sm">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer" />
//                     <span className="text-slate-600 dark:text-slate-400">Remember me</span>
//                   </label>
//                   <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition">
//                     Forgot password?
//                   </button>
//                 </div>

//                 {/* Sign In Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Signing in...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Sign In</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>

//                 {/* Sign Up Link */}
//                 <div className="text-center">
//                   <p className="text-slate-600 dark:text-slate-400 text-sm">
//                     New to Ajay Gadhi?{' '}
//                     <button 
//                       type="button"
//                       onClick={() => setActiveTab('register')}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
//                     >
//                       Create account
//                     </button>
//                   </p>
//                 </div>
//               </form>
//             )}

//             {/* Register Form */}
//             {activeTab === 'register' && (
//               <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5 animate-slide-in">
                
//                 {/* Username Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username</label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="johndoe"
//                       {...registerForm.register('username')}
//                       className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
//                     />
//                   </div>
//                   {registerForm.formState.errors.username && (
//                     <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                       <span>●</span> {registerForm.formState.errors.username.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
//                     <input
//                       type="email"
//                       placeholder="your@email.com"
//                       {...registerForm.register('email')}
//                       className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
//                     />
//                   </div>
//                   {registerForm.formState.errors.email && (
//                     <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                       <span>●</span> {registerForm.formState.errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
//                     <input
//                       type={showPassword.register ? 'text' : 'password'}
//                       placeholder="Create a strong password"
//                       {...registerForm.register('password')}
//                       className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
//                       className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
//                     >
//                       {showPassword.register ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                   {registerForm.formState.errors.password && (
//                     <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                       <span>●</span> {registerForm.formState.errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password Input */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
//                     <input
//                       type={showConfirm ? 'text' : 'password'}
//                       placeholder="Re-enter password"
//                       {...registerForm.register('confirmPassword')}
//                       className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirm(!showConfirm)}
//                       className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
//                     >
//                       {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                   {registerForm.formState.errors.confirmPassword && (
//                     <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                       <span>●</span> {registerForm.formState.errors.confirmPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Terms */}
//                 <label className="flex items-start gap-3 cursor-pointer">
//                   <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer" />
//                   <span className="text-slate-600 dark:text-slate-400 text-sm">
//                     I agree to the <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">Terms of Service</button> and <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">Privacy Policy</button>
//                   </span>
//                 </label>

//                 {/* Create Account Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Creating account...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Create Account</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>

//                 {/* Sign In Link */}
//                 <div className="text-center">
//                   <p className="text-slate-600 dark:text-slate-400 text-sm">
//                     Already have an account?{' '}
//                     <button 
//                       type="button"
//                       onClick={() => setActiveTab('login')}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
//                     >
//                       Sign in
//                     </button>
//                   </p>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-slate-600 dark:text-slate-500 text-xs mt-8">
//           © 2024 Ajay Gadhi Bandar CRM. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }

//version 2
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ login: false, register: false });
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema)
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onLogin = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', data);
      const { user } = response.data.data;
      setUser(user);
      setSubmitSuccess(true);
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data) => {
    try {
      setLoading(true);
      const { confirmPassword, ...registerData } = data;
      const response = await api.post('/auth/register', registerData);
      const { user } = response.data.data;
      setUser(user);
      setSubmitSuccess(true);
      toast.success('Registration successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
      `}</style>

      <div className="w-full max-w-md animate-slide-in">
        {/* Success Message */}
        {submitSuccess && (
          <div className="fixed top-4 right-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3 animate-slide-in z-50 shadow-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-800 dark:text-green-300">Success! Welcome to Ajay Gadhi CRM</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ajay Gadhi Bandar</h1>
          <p className="text-slate-600 dark:text-slate-400">CRM Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 gap-2">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 font-semibold text-sm rounded-lg transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-4 font-semibold text-sm rounded-lg transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Content Container */}
          <div className="p-8">
            
            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="space-y-6 animate-slide-in">
                
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...loginForm.register('email')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-transparent dark:focus:ring-0 transition-all"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>●</span> {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword.login ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...loginForm.register('password')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                      {showPassword.login ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>●</span> {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer" 
                    />
                    <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="button"
                  onClick={loginForm.handleSubmit(onLogin)}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    New to Ajay Gadhi?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
                    >
                      Create account
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="space-y-5 animate-slide-in">
                
                {/* Username Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="johndoe"
                      {...registerForm.register('username')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                  </div>
                  {registerForm.formState.errors.username && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>●</span> {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...registerForm.register('email')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>●</span> {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword.register ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...registerForm.register('password')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                      {showPassword.register ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>●</span> {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      {...registerForm.register('confirmPassword')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>●</span> {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 text-sm">
                    I agree to the <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">Terms of Service</button> and <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">Privacy Policy</button>
                  </span>
                </label>

                {/* Create Account Button */}
                <button
                  type="button"
                  onClick={registerForm.handleSubmit(onRegister)}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 dark:text-slate-500 text-xs mt-8">
          © 2024 Ajay Gadhi Bandar CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}