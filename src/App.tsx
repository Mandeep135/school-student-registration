
import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [page, setPage] = useState<'login' | 'register' | 'dashboard'>(
    'register'
  );
  const [studentName, setStudentName] = useState('');

  function handleLogin(name: string, _token: string) {
    setStudentName(name);
    setPage('dashboard');
  }

  function logout() {
    setStudentName('');
    setPage('login');
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h1>StudentPortal</h1>
            <span>School Management System</span>
          </div>
        </div>

        <div className="nav-right">
          <span className="status-dot"></span>
          Student Management Portal
        </div>
      </header>

      <main className="main-content">
        {page === 'register' && (
          <Register onLogin={() => setPage('login')} />
        )}

        {page === 'login' && (
          <Login
            onRegister={() => setPage('register')}
            onSuccess={handleLogin}
          />
        )}

        {page === 'dashboard' && (
          <div className="auth-card dashboard">
            <div className="success-icon">✓</div>
            <h2>Welcome, {studentName}!</h2>
            <p>You have successfully signed in.</p>
            <button className="primary-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </main>

      <footer>
        © 2026 StudentPortal · School Registration System
      </footer>
    </div>
  );
}

export default App;
