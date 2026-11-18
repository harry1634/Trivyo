import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import AuthShowcase from '../components/layout/AuthShowcase';

const INPUT_CLASS =
  'w-full rounded-[11px] border border-[#E7E5E4] bg-white py-3.5 text-[15px] text-ink placeholder:text-[#A3A3A3] transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError('Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
      showToast('Welcome to Trivyo!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Google sign-in failed. Please try again.', 'error');
    }
  }

  function comingSoon(provider) {
    showToast(`${provider} sign-in is coming soon — use email or Google for now.`, 'info');
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <AuthShowcase />

      <div className="flex items-center justify-center bg-bg px-6 py-16">
        <div className="w-full max-w-[420px]">
          <h1 className="text-[32px] font-extrabold leading-tight text-[#171717]">Welcome back</h1>
          <p className="mt-2 text-[15px] text-[#737373]">Continue planning your next journey.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#171717]">Email</label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={`${INPUT_CLASS} pl-11 pr-4`}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#171717]">Password</label>
              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className={`${INPUT_CLASS} pl-11 pr-11`}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] transition-colors hover:text-ink"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex items-center gap-2 text-[#171717]/80">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#E7E5E4] text-primary accent-primary focus:ring-primary/20"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-primary transition-colors hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in'}
              {!loading && <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs text-[#A3A3A3]">
            <div className="h-px flex-1 bg-[#E7E5E4]" />
            or continue with
            <div className="h-px flex-1 bg-[#E7E5E4]" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleGoogle} className="flex items-center justify-center rounded-xl border border-[#E7E5E4] bg-white py-3 transition-colors hover:border-ink/20 hover:bg-bg-soft">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
            <button onClick={() => comingSoon('Apple')} className="flex items-center justify-center rounded-xl border border-[#E7E5E4] bg-white py-3 transition-colors hover:border-ink/20 hover:bg-bg-soft">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.462 2.166-1.207 2.897-.815.83-2.088 1.462-3.13 1.373-.135-1.098.44-2.244 1.166-2.958.815-.83 2.235-1.463 3.171-1.312zM20.66 17.4c-.556 1.28-.82 1.85-1.53 2.98-.99 1.577-2.386 3.542-4.126 3.556-1.545.014-1.942-1.02-4.03-1.01-2.09.012-2.527 1.028-4.073 1.014-1.74-.014-3.06-1.79-4.05-3.367C.437 17.42-.492 12.99 1.11 9.916c1.062-2.052 2.96-3.35 5.02-3.363 1.517-.014 2.95 1.026 3.876 1.026.925 0 2.664-1.27 4.492-1.084.765.032 2.914.31 4.294 2.334-.11.07-2.564 1.502-2.537 4.478.03 3.558 3.114 4.744 3.147 4.759-.026.083-.492 1.699-1.742 3.334z"/></svg>
            </button>
            <button onClick={() => comingSoon('Facebook')} className="flex items-center justify-center rounded-xl border border-[#E7E5E4] bg-white py-3 transition-colors hover:border-ink/20 hover:bg-bg-soft">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#737373]">
            New to Trivyo?{' '}
            <Link to="/register" className="font-medium text-primary transition-colors hover:text-primary-dark">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
