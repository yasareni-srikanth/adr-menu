import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import logoImg from '../assets/LOGO1.jpg';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Query Supabase for admin credentials
      const { data, error: queryError } = await supabase
        .from('admins')
        .select('id, username, password')
        .eq('username', username)
        .single();

      if (queryError || !data) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Verify password matches
      if (data.password === password) {
        // Store auth token in localStorage
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUsername', username);
        navigate('/admin-dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
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

        {/* Error Message */}
        {error && (
          <div style={{ marginBottom: 20, padding: '12px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

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
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px 16px', paddingRight: '44px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 15, fontFamily: "'DM Sans', sans-serif", background: '#f9fafb', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#d97706'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d97706'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)', transition: 'transform 0.1s, box-shadow 0.2s', opacity: loading ? 0.8 : 1 }}
            onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
            disabled={loading}>
            {loading ? '🔄 Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
