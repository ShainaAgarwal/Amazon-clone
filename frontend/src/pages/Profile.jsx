import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Profile.css';

export default function Profile({ onBackToStore }) {
  const userInfo = useSelector((state) => state.auth?.userInfo || null);
  
  
  const [savedAddress, setSavedAddress] = useState(null);

  
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [phoneNumber, setPhoneNumber] = useState('');

  
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  
  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      setErrorMessage('Please sign in to view your address profile options.');
      setLoading(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    axios.get('http://localhost:5003/api/users/profile/address', config)
      .then((res) => {
        const addr = res.data.address; 
        if (addr && addr.addressLine1) {
          
          setSavedAddress(addr);

          
          setAddressLine1(addr.addressLine1 || '');
          setAddressLine2(addr.addressLine2 || '');
          setCity(addr.city || '');
          setState(addr.state || '');
          setPostalCode(addr.postalCode || '');
          setCountry(addr.country || 'United States');
          setPhoneNumber(addr.phoneNumber || '');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("GET profile error:", err.response?.data || err.message);
        setErrorMessage(err.response?.data?.message || 'Failed to load profile parameters.');
        setLoading(false);
      });
  }, [userInfo]);

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    
    const payload = { 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country, 
      phoneNumber 
    };

    axios.put('http://localhost:5003/api/users/profile/address', payload, config)
      .then((res) => {
        setSuccessMessage(res.data.message || 'Home address configuration saved successfully!');
        setSavedAddress(payload); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        console.error("PUT save error:", err.response?.data || err.message);
        setErrorMessage(err.response?.data?.message || 'Error saving address variables to database.');
      });
  };

  if (loading) return <h2 className="profile-fallback-text">Loading secure user context...</h2>;

  return (
    <div className="profile-page-view">
      <div className="profile-navigation-crumbs">
        <span onClick={onBackToStore} className="crumb-link">Your Account</span> &gt; <span className="crumb-active">Your Profile Settings</span>
      </div>

      <h1 className="profile-main-heading">Your Profile Details</h1>

      {successMessage && <div className="profile-status-alert success">{successMessage}</div>}
      {errorMessage && <div className="profile-status-alert error">{errorMessage}</div>}

      {/* Account Identity Card */}
      <div className="profile-user-details-card">
        <div className="user-detail-row">
          <span className="user-detail-label">Name / Username:</span>
          <span className="user-detail-value text-capitalize">{userInfo?.username || 'N/A'}</span>
        </div>
        <div className="user-detail-row">
          <span className="user-detail-label">Email Address:</span>
          <span className="user-detail-value">{userInfo?.email || 'N/A'}</span>
        </div>
      </div>

      {/* Saved Address Preview */}
      <h2 className="profile-sub-heading">Currently Active Address Profile</h2>
      <div className="profile-user-details-card current-address-preview-box" style={{ borderLeft: '4px solid #e47911', backgroundColor: '#fcfcfc' }}>
        {savedAddress && savedAddress.addressLine1 ? (
          <div style={{ lineHeight: '1.6' }}>
            <strong>{userInfo?.username}</strong><br />
            {savedAddress.addressLine1} {savedAddress.addressLine2 && `, ${savedAddress.addressLine2}`}<br />
            {savedAddress.city}, {savedAddress.state} {savedAddress.postalCode}<br />
            {savedAddress.country}<br />
            {savedAddress.phoneNumber && <span>Phone: {savedAddress.phoneNumber}</span>}
          </div>
        ) : (
          <div style={{ color: '#565959', fontStyle: 'italic' }}>No default address configuration synchronized on file. Please register an address profile below.</div>
        )}
      </div>

      <h2 className="profile-sub-heading">Manage Home Address</h2>

      <div className="address-card-workspace">
        <form onSubmit={handleSubmitAddress} className="amazon-address-form">
          
          <div className="form-input-group">
            <label>Country/Region</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="India">India</option>
            </select>
          </div>

          <div className="form-input-group">
            <label>Street address</label>
            <input 
              type="text" 
              placeholder="Street address, P.O. box, company name" 
              value={addressLine1} 
              onChange={(e) => setAddressLine1(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Apartment, suite, unit, building, floor, etc. (optional)" 
              value={addressLine2} 
              onChange={(e) => setAddressLine2(e.target.value)}
              className="split-address-line"
            />
          </div>

          <div className="form-grid-three-column">
            <div className="form-input-group">
              <label>City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="form-input-group">
              <label>State / Province / Region</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
            <div className="form-input-group">
              <label>ZIP / Postal Code</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            </div>
          </div>

          <div className="form-input-group">
            <label>Phone number</label>
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
            />
          </div>

          <div className="form-actions-row" style={{ marginTop: '12px' }}>
            <button type="submit" className="amazon-profile-save-btn">Save Changes</button>
            <button type="button" onClick={onBackToStore} className="amazon-profile-cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}