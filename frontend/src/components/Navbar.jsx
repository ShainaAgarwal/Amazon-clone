import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';

export default function Navbar() {
  const user = useSelector(state => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">amazon.clone</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
          </>
        )}
      </div>
    </nav>
  );
}