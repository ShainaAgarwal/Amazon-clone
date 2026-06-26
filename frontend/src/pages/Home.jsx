import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { addItem } from '../store'; 
import Cart from './Cart';
import Profile from './Profile';
import Checkout from './Checkout'; 
import PlacedOrders from './PlacedOrders'; 
import axios from 'axios';
import './Home.css'; 
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false); 
  const [showOrders, setShowOrders] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);         
  const [includeOutOfStock, setIncludeOutOfStock] = useState(true); 
  const [sortBy, setSortBy] = useState('relevance');              

  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const dispatch = useDispatch(); 
  const cartItems = useSelector(state => state.cart?.items || []);
  const userInfo = useSelector(state => state.auth?.userInfo || null);

  useEffect(() => {
    setLoading(true);
    setError('');

    axios.get(`http://localhost:5003/api/admin/public/products?page=${currentPage}&limit=8`)
      .then(res => {
        if (res.data.products) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setProducts(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load products');
        setLoading(false);
      });
  }, [currentPage]);

  const calculateTotalQuantity = () => { 
    return cartItems.reduce((total, item) => total + item.quantity, 0); 
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('');
    setSelectedRating(0);
    setIncludeOutOfStock(true);
    setSortBy('relevance');
    setCurrentPage(1);
    setShowOrders(false); 
  };

  const handleOrderSuccessComplete = () => {
    cartItems.forEach(item => {
      dispatch({ type: 'cart/removeItem', payload: item.id });
    });
    setShowCheckout(false);
    setShowCart(false);
    setShowOrders(true); 
    handleResetAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    dispatch({ type: 'auth/logout' }); 
    setShowDropdown(false);
    navigate('/login');
  };

  const filteredProducts = products.filter(product => {
    const title = (product.title || product.name || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = title.includes(query) || category.includes(query);
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    const matchesMinPrice = minPrice === '' || Number(product.price) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || Number(product.price) <= Number(maxPrice);

    const currentRating = product.rating !== undefined ? product.rating : 4.5;
    const matchesRating = currentRating >= selectedRating;

    const isItemInStock = product.countInStock !== undefined ? product.countInStock > 0 : true;
    const matchesStock = includeOutOfStock || isItemInStock;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'ratingDesc') {
      const ratingA = a.rating !== undefined ? a.rating : 4.5;
      const ratingB = b.rating !== undefined ? b.rating : 4.5;
      return ratingB - ratingA;
    }
    return 0;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const getGroupedProducts = () => {
    return sortedProducts.reduce((acc, product) => {
      const found = acc.find(group => group.category === product.category);
      if (found) {
        found.itemsList.push(product);
      } else {
        acc.push({ category: product.category, itemsList: [product] });
      }
      return acc;
    }, []);
  };

  if (loading) return <h2 className="fallback-loading-state">Loading Products...</h2>;
  if (error) return <h2 className="fallback-error-state">{error}</h2>;

  return (
    <div className="app-container">
      {/*  Navigation Header */}
      <header className="navbar">
        <div 
          className="navbar-brand-container" 
          onClick={() => { setShowCart(false); setShowProfile(false); setShowCheckout(false); setShowOrders(false); handleResetAll(); }}
        >
          <span className="brand-logo-text">amazon</span>
          <span className="brand-logo-accent">.clone</span>
        </div>

        <div className="nav-search-container">
          <input 
            type="text" 
            className="nav-search-field" 
            placeholder="Search electronics, fashion, updates..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowCart(false);
              setShowProfile(false);
              setShowCheckout(false);
              setShowOrders(false);
            }}
          />
          <span className="search-icon-badge">🔍</span>
        </div>

        <div className="navbar-links">
          {/* Account Dropdown */}
          <div 
            className="nav-profile-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="nav-profile-block">
              <span className="nav-line-one">Hello, {userInfo ? userInfo.username : 'sign in'}</span>
              <span className="nav-line-two">Account & Lists ▾</span>
            </div>

            {showDropdown && (
              <div className="nav-account-dropdown">
                {!userInfo ? (
                  <div className="dropdown-anonymous-view">
                    <button className="amazon-dropdown-login-btn" onClick={() => { navigate('/login'); setShowDropdown(false); }}>
                      Sign In
                    </button>
                    <p className="dropdown-signup-prompt">
                      New customer? <span onClick={() => { navigate('/register'); setShowDropdown(false); }}>Start here.</span>
                    </p>
                  </div>
                ) : (
                  <div className="dropdown-authenticated-view">
                    <div className="dropdown-menu-item" onClick={() => { setShowProfile(true); setShowCart(false); setShowCheckout(false); setShowOrders(false); setShowDropdown(false); }}>
                      Your Account
                    </div>
                    
                    <div className="dropdown-menu-item" onClick={() => { setShowOrders(true); setShowCart(false); setShowCheckout(false); setShowProfile(false); setShowDropdown(false); }}>
                      Placed Orders
                    </div>
                    <div className="dropdown-menu-item" onClick={() => { setShowCheckout(false); setShowCart(true); setShowOrders(false); setShowProfile(false); setShowDropdown(false); }}>
                      Shopping Cart
                    </div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-menu-item signout-action" onClick={handleSignOut}>
                      Sign Out
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button className="nav-storefront-btn" onClick={() => { setShowCart(false); setShowProfile(false); setShowCheckout(false); setShowOrders(false); handleResetAll(); }}>
          <span className="nav-line-one">Return to</span>
          <span className="nav-line-two">Storefront</span>
        </button>

        {/* Cart */}
        <div onClick={() => { setShowCart(true); setShowProfile(false); setShowCheckout(false); setShowOrders(false); }} className="nav-cart-trigger">
          <div className="cart-icon-container">
            <span className="cart-badge-count">{calculateTotalQuantity()}</span>
            <span className="cart-emoji-icon">🛒</span>
          </div>
          <span className="nav-line-two cart-label">Cart</span>
        </div>
      </header>

      
      {showCheckout ? (
        <Checkout 
          onBackToCart={() => { setShowCheckout(false); setShowCart(true); }}
          onOrderSuccess={handleOrderSuccessComplete}
        />
      ) : showProfile ? (
        <Profile onBackToStore={() => setShowProfile(false)} />
      ) : showOrders ? (
        
        <PlacedOrders onBackToStore={handleResetAll} />
      ) : !showCart ? (
        <div className="storefront-layout-grid">
          
          {/* Left Sidebar */}
          <aside className="filter-sidebar-panel">
            <div className="sidebar-group">
              <h4 className="sidebar-title">Category</h4>
              <ul className="category-filter-list">
                <li 
                  onClick={() => setSelectedCategory('')} 
                  className={selectedCategory === '' ? 'active-filter' : ''}
                >
                  All Categories
                </li>
                {uniqueCategories.map((cat, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={selectedCategory === cat ? 'active-filter text-capitalize' : 'text-capitalize'}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-group">
              <h4 className="sidebar-title">Customer Reviews</h4>
              <div className="reviews-filter-column">
                {[4, 3, 2].map((stars) => (
                  <div 
                    key={stars} 
                    onClick={() => setSelectedRating(stars)} 
                    className={selectedRating === stars ? 'active-rating' : 'inactive-rating'}
                  >
                    {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)} & Up
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-group">
              <h4 className="sidebar-title">Price Range</h4>
              <div className="price-input-range-row">
                <input 
                  type="number" 
                  placeholder="$ Min" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                  className="price-range-field"
                />
                <input 
                  type="number" 
                  placeholder="$ Max" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                  className="price-range-field"
                />
              </div>
            </div>

            <div className="sidebar-group">
              <h4 className="sidebar-title">Availability</h4>
              <label className="checkbox-filter-label">
                <input 
                  type="checkbox" 
                  checked={!includeOutOfStock} 
                  onChange={(e) => setIncludeOutOfStock(!e.target.checked)} 
                />
                Hide Out of Stock
              </label>
            </div>

            <button onClick={handleResetAll} className="sidebar-clear-btn">
              Clear All Filters
            </button>
          </aside>

          {/* 🛍️ Main Product Feed Area Canvas */}
          <main className="home-container">
            <div className="home-banner-wrapper">
              <img 
                className="home-banner" 
                src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg" 
                alt="Amazon Banner" 
              />
            </div>

            <div className="sorting-results-bar">
              <span className="results-count-text">
                Showing <strong>{sortedProducts.length}</strong> matches
              </span>
              
              <div className="sort-dropdown-wrapper">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select-menu"
                >
                  <option value="relevance">Featured / Relevance</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="ratingDesc">Highest Rated</option>
                </select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="no-results-panel">
                <h3>No items matching your layout configuration filter metrics found.</h3>
                <button className="amazon-btn auto-width-btn" onClick={handleResetAll}>
                  Reset Global View Grid
                </button>
              </div>
            ) : (
              getGroupedProducts().map((group, idx) => (
                <div key={idx} className="category-section-lane">
                  <h2 className="category-row-title">{group.category}</h2>
                  
                  <div className="product-grid">
                    {group.itemsList.map(product => {
                      const isInCart = cartItems.some(item => item.id === product._id);
                      const displayRating = product.rating !== undefined ? product.rating : 4.5;
                      const displayStockStatus = product.countInStock !== undefined ? product.countInStock > 0 : true;

                      const cartPayload = {
                        id: product._id,
                        name: product.title || product.name,
                        image: product.image,
                        cost: `$${Number(product.price).toFixed(2)}`
                      };

                      return (
                        <div key={product._id} className="product-card">
                          <div className="clickable-product-target" onClick={() => setSelectedProduct(product)}>
                            <div className="product-title">{product.title || product.name}</div>
                            
                            <div className="product-star-rating-row">
                              <span>{'⭐'.repeat(Math.floor(displayRating))}</span>
                              <span className="rating-numeric-span">({displayRating})</span>
                            </div>

                            <div className="product-price">${Number(product.price).toFixed(2)}</div>
                            <div className="product-card-image-box">
                              <img src={product.image} alt={product.title || product.name} />
                            </div>
                          </div>

                          <p className="product-description-snippet">
                            {!displayStockStatus ? (
                              <span className="out-of-stock-alert">Temporarily Out of Stock</span>
                            ) : (
                              product.description
                            )}
                          </p>

                          <div className="product-card-actions-dock">
                            <button className="detail-inspect-link-btn" onClick={() => setSelectedProduct(product)}>
                              🔎 Quick View Product Details
                            </button>

                            <button 
                              className="amazon-btn" 
                              disabled={isInCart || !displayStockStatus}
                              onClick={() => dispatch(addItem(cartPayload))}
                              style={{ 
                                backgroundColor: (!displayStockStatus || isInCart) ? '#e7e9ec' : '#f0c14b', 
                                borderColor: (!displayStockStatus || isInCart) ? '#adb1b8' : '#a88734'
                              }}
                            >
                              {!displayStockStatus ? 'Out of Stock' : isInCart ? 'Added to Shopping Basket' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {totalPages > 1 && (
              <div className="pagination-bar-dock">
                <button 
                  className="amazon-btn pagination-padding" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  ◀ Previous Page
                </button>
                <span className="pagination-info-text">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="amazon-btn pagination-padding" 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next Page ▶
                </button>
              </div>
            )}
          </main>
        </div>
      ) : (
        <Cart 
          onContinueShopping={() => setShowCart(false)} 
          onProceedToCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {/* 🏷️ Focus Detail Modal Layer Sheet */}
      {selectedProduct && (
        <div className="detail-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            
            <div className="modal-content-grid">
              <div className="modal-image-pane">
                <img src={selectedProduct.image} alt={selectedProduct.title || selectedProduct.name} />
              </div>
              
              <div className="modal-details-pane">
                <span className="modal-category-tag">{selectedProduct.category}</span>
                <h1 className="modal-title-header">{selectedProduct.title || selectedProduct.name}</h1>
                <div className="modal-price-tag">${Number(selectedProduct.price).toFixed(2)}</div>
                
                <div className="modal-description-block">
                  <h5>Product Description</h5>
                  <p>{selectedProduct.description || "No description provided for this item."}</p>
                </div>

                <div className="modal-meta-status-row">
                  <div>🚚 <strong>Free Shipping:</strong> Amazon Clone Prime Eligible</div>
                  <div>📦 <strong>Availability:</strong> {(selectedProduct.countInStock !== undefined ? selectedProduct.countInStock > 0 : true) ? 'In Stock and Ready to Ship' : 'Out of Stock'}</div>
                </div>

                <button 
                  className="amazon-btn"
                  disabled={cartItems.some(item => item.id === selectedProduct._id) || (selectedProduct.countInStock !== undefined ? selectedProduct.countInStock <= 0 : false)}
                  onClick={() => {
                    dispatch(addItem({
                      id: selectedProduct._id,
                      name: selectedProduct.title || selectedProduct.name,
                      image: selectedProduct.image,
                      cost: `$${Number(selectedProduct.price).toFixed(2)}`
                    }));
                    setSelectedProduct(null);
                  }}
                  style={{
                    backgroundColor: (cartItems.some(item => item.id === selectedProduct._id) || (selectedProduct.countInStock !== undefined ? selectedProduct.countInStock <= 0 : false)) ? '#e7e9ec' : '#f0c14b',
                    borderColor: (cartItems.some(item => item.id === selectedProduct._id) || (selectedProduct.countInStock !== undefined ? selectedProduct.countInStock <= 0 : false)) ? '#adb1b8' : '#a88734'
                  }}
                >
                  {(selectedProduct.countInStock !== undefined ? selectedProduct.countInStock <= 0 : false)
                    ? 'Item Currently Out Of Stock'
                    : cartItems.some(item => item.id === selectedProduct._id) 
                      ? 'Item Already Saved in Shopping Basket' 
                      : 'Confirm & Add Item to Shopping Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}