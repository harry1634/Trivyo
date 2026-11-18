import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthShowcase from '../components/layout/AuthShowcase';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('Could not send reset email. Check the address and try again.');
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <AuthShowcase />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-ink">Reset your password</h1>
          {sent ? (
            <p className="mt-4 text-sm text-success">Check your inbox for a password reset link.</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          )}
          <p className="mt-4 text-sm text-ink/70">
            <Link to="/login" className="text-primary-dark">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
