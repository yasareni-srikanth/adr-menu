import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/LOGO1.jpg';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded auth for demonstration
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(170deg, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)', color: '#1f2937', fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      {/* Background Accent */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(180,83,9,0.09), transparent)' }} />

      <div style={{ position: 'relative', background: '#fff', padding: '40px 32px', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: 420, border: '1px solid rgba(180,83,9,0.12)' }}>

        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 0 4px rgba(180,83,9,0.1), 0 10px 20px rgba(0,0,0,0.15)', border: '1px solid rgba(180,83,9,0.2)', overflow: 'hidden' }}>
            <img src={logoImg} alt="Athithi Delight Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, margin: 0, color: '#1c1917' }}>Athithi <span style={{ fontStyle: 'italic', color: '#78716c' }}>Admin</span></h2>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b45309', marginTop: 8, fontWeight: 700 }}>Secure Login</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 15, fontFamily: "'DM Sans', sans-serif", background: '#f9fafb', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#d97706'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 15, fontFamily: "'DM Sans', sans-serif", background: '#f9fafb', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#d97706'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)', transition: 'transform 0.1s, box-shadow 0.2s' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
