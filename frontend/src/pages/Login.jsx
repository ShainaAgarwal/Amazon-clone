import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://amazon-clone-fgea.onrender.com/api/auth/login', { email, password });
      dispatch(
        loginSuccess({
          user: res.data.userInfo,
          token: res.data.token
        })
      );
      const user = res.data.userInfo;
      if (user && user.isAdmin) {
        navigate('/admin'); // Send admins to the dashboard
      } else {
        navigate('/'); // Send shoppers to the home page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
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
        <h2>Sign-In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-submit-btn">Continue</button>
        </form>

        <p className="auth-legal-notice">
          By continuing, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
        </p>

        <div className="auth-divider-break">
          <h5>New to Amazon?</h5>
        </div>

        <button className="auth-create-account-btn" onClick={() => navigate('/register')}>
          Create your Amazon account
        </button>
      </div>
    </div>
  );
}