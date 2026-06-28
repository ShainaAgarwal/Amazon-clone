import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await axios.post('https://amazon-clone-1-wo94.onrender.com/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      navigate('/login');
    } catch (err) {
      console.log("ERROR:", err);
      console.log("RESPONSE:", err.response);
      console.log("DATA:", err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-logo" onClick={() => navigate('/')}>
        amazon<span>.clone</span>
      </div>

      
      {error && (
        <div className="auth-error-banner">
          <div className="auth-error-content">
            <h4>There was a problem</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="auth-container">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your name</label>
            <input 
              type="text" 
              placeholder="First and last name"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="At least 6 characters" 
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" className="auth-submit-btn">Verify email</button>
        </form>

        <p className="auth-legal-notice">
          By creating an account, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
        </p>

        <div className="auth-switch-link-row">
          Already have an account?{' '}
          <span style={{ color: '#007185', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/login')}>
            Sign in ▸
          </span>
        </div>
      </div>
    </div>
  );
}