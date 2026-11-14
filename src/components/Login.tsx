
import { useState, type FormEvent } from 'react';

type Props = {
  onRegister: () => void;
  onSuccess: (name: string, token: string) => void;
};

export default function Login({ onRegister, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      if (!data.token) {
        throw new Error('Authentication token was not returned.');
      }

      onSuccess(data.name || 'Student', data.token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to log in.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="card-heading">
        <h2>Welcome Back</h2>
        <p>Sign in to your student account</p>
      </div>

      <form onSubmit={handleLogin}>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button className="primary-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="switch-text">
        Don't have an account?{' '}
        <button className="text-btn" onClick={onRegister}>
          Register Now
        </button>
      </p>
    </div>
  );
}
