import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './PlacedOrders.css';

export default function PlacedOrders({ onBackToStore }) {
  const userInfo = useSelector((state) => state.auth?.userInfo || null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      setError('Please sign in to view your order history.');
      setLoading(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    
    axios.get('https://amazon-clone-1-wo94.onrender.com/api/orders/myorders', config)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to retrieve your order history.');
        setLoading(false);
      });
  }, [userInfo]);

  if (loading) return <h2 className="orders-fallback-text">Loading your order history...</h2>;
  if (error) return <div className="orders-error-panel">{error}</div>;

  return (
    <div className="orders-history-container">
      <div className="orders-header-row">
        <h1>Your Orders</h1>
        <button onClick={onBackToStore} className="amazon-btn back-store-btn">Return to Storefront</button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders-card">
          <h3>You haven't placed any orders yet.</h3>
          <button onClick={onBackToStore} className="amazon-btn standard-yellow-btn">Shop catalog items</button>
        </div>
      ) : (
        <div className="orders-list-wrapper">
          {orders.map((order) => (
            <div key={order._id} className="order-main-card">
              
              
              <div className="order-card-metadata-header">
                <div className="meta-info-block">
                  <span className="meta-label">ORDER PLACED</span>
                  <span className="meta-value">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="meta-info-block">
                  <span className="meta-label">TOTAL</span>
                  <span className="meta-value-price">${Number(order.totalPrice).toFixed(2)}</span>
                </div>
                <div className="meta-info-block ship-to-block">
                  <span className="meta-label">SHIP TO</span>
                  <span className="meta-value-link">
                    {order.shippingAddress?.addressLine1 || userInfo?.username || 'Saved Customer'} ▾
                  </span>
                </div>
                <div className="meta-order-id-block">
                  <span className="meta-label">ORDER #</span>
                  <span className="meta-value-id">{order._id}</span>
                </div>
              </div>

              
              <div className="order-items-body-container">
                
                {(order.cartItems || order.orderItems || []).map((item, idx) => {
                  
                  const rawCost = item.cost || item.price || "0.00";
                  const displayPrice = typeof rawCost === 'string' 
                    ? parseFloat(rawCost.replace('$', '')) 
                    : Number(rawCost);

                  return (
                    <div key={item.id || idx} className="ordered-product-item-row">
                      <img src={item.image} alt={item.name || item.title} className="ordered-product-img" />
                      <div className="ordered-product-details">
                        <h4>{item.name || item.title}</h4>
                        <div className="ordered-product-price-meta">
                          Price: <strong className="item-price-tag">${displayPrice.toFixed(2)}</strong>
                        </div>
                        <span className="ordered-product-qty">Quantity ordered: {item.quantity}</span>
                      </div>
                      <div className="order-item-actions-sidebar">
                        <button className="amazon-btn standard-yellow-btn buy-again-btn">Buy it again</button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}