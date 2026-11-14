
import { useState, type FormEvent } from 'react';

type Props = {
  onLogin: () => void;
};

export default function Register({ onLogin }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setMessage('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      alert('Registration successful! Please log in.');
      onLogin();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="card-heading">
        <h2>Create Account</h2>
        <p>Register to access your student portal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={updateField}
          required
        />

        <label>Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="student@example.com"
          value={form.email}
          onChange={updateField}
          required
        />

        <label>Contact Number</label>
        <input
          name="contact"
          type="tel"
          placeholder="Enter contact number"
          value={form.contact}
          onChange={updateField}
          required
        />

        <label>Gender</label>
        <select
          name="gender"
          value={form.gender}
          onChange={updateField}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={form.password}
          onChange={updateField}
          minLength={8}
          required
        />

        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={updateField}
          required
        />

        {message && <p className="error-message">{message}</p>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="switch-text">
        Already have an account?{' '}
        <button className="text-btn" onClick={onLogin}>
          Sign In
        </button>
      </p>
    </div>
  );
}
