import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const auth = useSelector(state => state.auth || {});
  const token = auth.token;
  
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({ 
    title: '', 
    price: '', 
    description: '', 
    image: '', 
    category: '',
    rating: 4.5,
    countInStock: 10
  });
  const [msg, setMsg] = useState('');

  const fetchInventory = () => {
    if (!token) return;

    axios.get('http://localhost:5003/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5003/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5003/api/admin/products', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5003/api/admin/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Product launched into marketplace catalog successfully!');
      setProductData({ title: '', price: '', description: '', image: '', category: '', rating: 4.5, countInStock: 10 });
      fetchInventory();
    } catch (err) {
      setMsg('Failed to update product database.');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Amazon Console Management Hub</h2>
      </header>
      
      <div className="admin-grid-top">
        
        <div className="admin-card">
          <h3>Add New Inventory Listing</h3>
          {msg && <p className="admin-message">{msg}</p>}
          <form onSubmit={handleAddProduct}>
            <div className="form-group">
              <label>Product Title</label>
              <input type="text" value={productData.title} onChange={e => setProductData({...productData, title: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Price ($)</label>
                <input type="number" step="0.01" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} required />
              </div>
              <div className="form-group flex-1">
                <label>Stock Volume</label>
                <input type="number" min="0" value={productData.countInStock} onChange={e => setProductData({...productData, countInStock: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description Narrative</label>
              <textarea value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Image Repository URL</label>
              <input type="text" value={productData.image} onChange={e => setProductData({...productData, image: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Category Hub</label>
                <input type="text" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} required />
              </div>
              <div className="form-group flex-1">
                <label>Benchmark Rating</label>
                <input type="number" step="0.1" min="0" max="5" value={productData.rating} onChange={e => setProductData({...productData, rating: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="amazon-btn">Publish Merchant Listing</button>
          </form>
        </div>

        <div className="admin-card">
          <h3>Registered System Users Account Log</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email Address</th>
                  <th>Role Clearance</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="font-medium">{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.isAdmin ? 'role-admin' : 'role-shopper'}`}>
                        {u.isAdmin ? '👑 Admin' : '👤 Shopper'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-card admin-fullwidth">
        <h3>Live Marketplace Catalog Inventory ({products.length})</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Product Identifier</th>
                <th>Category</th>
                <th>Price Matrix</th>
                <th>Stock Units</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">No active catalog product data discovered in database logs.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt={product.title} className="product-thumbnail-preview" />
                    </td>
                    <td>
                      <div className="font-medium text-dark">{product.title}</div>
                      <div className="font-mono font-muted">{product._id}</div>
                    </td>
                    <td><span className="category-tag">{product.category}</span></td>
                    <td className="font-bold text-dark">${product.price?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${product.countInStock > 0 ? 'status-paid' : 'status-pending'}`}>
                        {product.countInStock > 0 ? `${product.countInStock} Available` : 'Out of Stock'}
                      </span>
                    </td>
                    <td>⭐ {product.rating} / 5</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card admin-fullwidth">
        <h3>Global Orders Transaction Tracking Log</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer Identity Address</th>
                <th>Items Purchased</th>
                <th>Total Financial Price</th>
                <th>Payment Status</th>
                <th>Purchase Execution Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">No recent transaction orders found.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td className="font-mono font-medium">{order._id}</td>
                    <td>{order.user?.email || order.user || 'Anonymous Merchant'}</td>
                    <td>
                      <ul className="order-items-list">
                        {order.orderItems?.map((item, idx) => (
                          <li key={idx}>
                            {item.title} <strong className="text-dark">(x{item.quantity})</strong>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="font-bold text-dark">${order.totalPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.isPaid ? 'status-paid' : 'status-pending'}`}>
                        {order.isPaid ? 'Settled Paid' : 'Pending Verification'}
                      </span>
                    </td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}