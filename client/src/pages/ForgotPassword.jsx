import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowRight, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import api from '@/services/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const OtpVerificationSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits')
});

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const emailForm = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const otpForm = useForm({
    resolver: zodResolver(OtpVerificationSchema)
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onEmailSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post('/users/forgot-password', { email: data.email });
      setEmail(data.email);
      setStep('otp');
      setCountdown(300);
      toast.success(t('auth.otpSent') || 'OTP sent to your email');
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.failedSendOtp') || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/users/verify-otp', {
        email,
        otp: data.otp
      });
      
      sessionStorage.setItem('resetToken', response.data.data.resetToken);
      setStep('password');
      toast.success(t('auth.otpVerified') || 'OTP verified successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.invalidOtp') || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      const resetToken = sessionStorage.getItem('resetToken');
      
      await api.post('/users/reset-password', {
        email,
        newPassword: data.password,
        resetToken
      });
      
      sessionStorage.removeItem('resetToken');
      toast.success(t('auth.passwordResetSuccess') || 'Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.failedResetPassword') || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await api.post('/users/forgot-password', { email });
      setCountdown(300);
      toast.success(t('auth.otpResent') || 'OTP resent to your email');
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(t('auth.failedResendOtp') || 'Failed to resend OTP');
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
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg mb-5">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('auth.resetPassword') || 'Reset Password'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('auth.recoverAccountAccess') || 'Recover your account access'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8">
            
            {/* Step 1: Email Submission */}
            {step === 'email' && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('auth.email') || 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...emailForm.register('email')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('auth.enterEmailForOtp') || 'Enter your registered email address and we\'ll send you an OTP to reset your password.'}
                </p>

                <button
                  onClick={emailForm.handleSubmit(onEmailSubmit)}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('auth.sendingOtp') || 'Sending OTP...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.sendOtp') || 'Send OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {t('auth.rememberPassword') || 'Remember your password?'}{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
                    >
                      {t('auth.signIn') || 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('auth.enterOtp') || 'Enter OTP'}
                  </label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {t('auth.otpSentTo') || `We've sent a 6-digit OTP to`} {email}
                  </p>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    inputMode="numeric"
                    {...otpForm.register('otp')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-mono text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t('auth.otpExpiresIn') || 'OTP expires in'}:</span>
                  <span className={`font-semibold ${countdown < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                    {formatCountdown(countdown)}
                  </span>
                </div>

                {countdown === 0 && (
                  <button
                    onClick={handleResendOtp}
                    className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition"
                  >
                    {t('auth.didntReceiveOtp') || "Didn't receive OTP? Resend"}
                  </button>
                )}

                <button
                  onClick={otpForm.handleSubmit(onOtpSubmit)}
                  disabled={loading || countdown === 0}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('auth.verifying') || 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.verifyOtp') || 'Verify OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep('email')}
                  className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold py-2.5 rounded-lg transition"
                >
                  {t('common.back') || 'Back to Email'}
                </button>
              </div>
            )}

            {/* Step 3: Password Reset */}
            {step === 'password' && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                    {t('auth.emailVerified') || 'Email verified successfully'}
                  </span>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('auth.newPassword') || 'New Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.createStrongPassword') || 'Create a strong password'}
                      {...resetForm.register('password')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {resetForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {resetForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('auth.confirmPassword') || 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.reEnterPassword') || 'Re-enter password'}
                      {...resetForm.register('confirmPassword')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('auth.passwordRequirements') || 'Password Requirements'}:
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <li>✓ {t('auth.passwordMinLength') || 'At least 6 characters long'}</li>
                    <li>✓ {t('auth.passwordMixed') || 'Mix of uppercase and lowercase letters'}</li>
                    <li>✓ {t('auth.passwordNumber') || 'Include at least one number'}</li>
                  </ul>
                </div>

                <button
                  onClick={resetForm.handleSubmit(onPasswordSubmit)}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('auth.resettingPassword') || 'Resetting Password...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.resetPassword') || 'Reset Password'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold py-2.5 rounded-lg transition"
                >
                  {t('auth.backToLogin') || 'Back to Login'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 dark:text-slate-500 text-xs mt-8">
          {t('auth.copyright') || '© 2024 Ajay Gadhi Bandar CRM. All rights reserved.'}
        </p>
      </div>
    </div>
  );
}