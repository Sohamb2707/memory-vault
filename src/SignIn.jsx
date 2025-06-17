import React, { useState } from 'react';
import { auth } from './firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Sign in successful!');
      
      navigate('/');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)' }} className="flex items-center justify-center h-screen">
      <div style={{ backgroundColor: '#fff' }} className="p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 style={{ color: 'var(--text-color)' }} className="text-2xl font-bold mb-6 text-center">
          Welcome Back
        </h2>
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label style={{ color: 'var(--secondary-accent)' }} className="block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderColor: 'var(--primary-accent)' }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cta-color"
            />
          </div>
          <div>
            <label style={{ color: 'var(--secondary-accent)' }} className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderColor: 'var(--primary-accent)' }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cta-color"
            />
          </div>
          {error && <p style={{ color: '#EF4444' }} className="text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: 'var(--cta-color)' }}
            className={`w-full py-2 text-white rounded-md hover:bg-opacity-80 transition ${loading && 'opacity-50 cursor-not-allowed'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
