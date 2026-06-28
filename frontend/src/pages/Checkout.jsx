import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Checkout.css';

export default function Checkout({ onBackToCart, onOrderSuccess }) {
  const cartItems = useSelector((state) => state.cart?.items || []);
  const userInfo = useSelector((state) => state.auth?.userInfo || null);

  // 1. Home / Billing Address State 
  const [homeAddress, setHomeAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phoneNumber: ''
  });

  // 2. Shipping Destination Address 
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phoneNumber: ''
  });

  // 3. Sync Checkbox State
  const [shippingSameAsHome, setShippingSameAsHome] = useState(false);

  // 4. Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  
  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      setErrorMessage('Please sign in to complete your checkout registration.');
      setLoading(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    
    axios.get('https://amazon-clone-1-wo94.onrender.com/api/users/profile/address', config)
      .then((res) => {
        const addr = res.data.address; 
        if (addr) {
          const baseAddress = {
            addressLine1: addr.addressLine1 || '',
            addressLine2: addr.addressLine2 || '',
            city: addr.city || '',
            state: addr.state || '',
            postalCode: addr.postalCode || '',
            country: addr.country || 'United States',
            phoneNumber: addr.phoneNumber || ''
          };

          setHomeAddress(baseAddress);

          
          setShippingAddress({ ...baseAddress });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Checkout address fetch drop:", err.response?.data || err.message);
        setLoading(false);
      });
  }, [userInfo]);

  
  useEffect(() => {
    if (shippingSameAsHome) {
      setShippingAddress({ ...homeAddress });
    }
  }, [shippingSameAsHome, homeAddress]);

  // Finance
  const calculateItemsSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = parseFloat(item.cost.replace('$', ''));
      return acc + price * item.quantity;
    }, 0);
  };

  const itemsSubtotal = calculateItemsSubtotal();
  const shippingCost = itemsSubtotal > 500 ? 0 : 15.00;
  const estimatedTax = itemsSubtotal * 0.0825;
  const orderGrandTotal = itemsSubtotal + shippingCost + estimatedTax;

  
  const handleAddressFieldChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const finalShipping = shippingSameAsHome ? homeAddress : shippingAddress;
    if (!finalShipping.addressLine1 || !finalShipping.city || !finalShipping.state || !finalShipping.postalCode) {
      setErrorMessage('Please specify missing required shipping destination metrics.');
      return;
    }

    if (!paymentMethod) {
      setErrorMessage('Please select a payment method to proceed.');
      return;
    }

    if (!userInfo || !userInfo.token) {
      setErrorMessage('Authentication identity missing. Please re-login to check out.');
      return;
    }

    setIsSubmitting(true);

    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}` 
      },
    };
    const mappedOrderItems = cartItems.map(item => {
      const numericPrice = typeof item.cost === 'string' 
        ? parseFloat(item.cost.replace('$', '')) 
        : Number(item.cost);
    
      return {
        product: item.id,
        title: item.name,
        image: item.image,
        price: numericPrice,
        quantity: Number(item.quantity)
      };
    });
    
    const orderPayload = {
      orderItems: mappedOrderItems,
      totalPrice: Number(orderGrandTotal.toFixed(2)),
      shippingAddress: {
        addressLine1: finalShipping.addressLine1,
        addressLine2: finalShipping.addressLine2 || '',
        city: finalShipping.city,
        state: finalShipping.state,
        postalCode: finalShipping.postalCode,
        country: finalShipping.country || 'United States'
      }
    };
    

    axios.post('https://amazon-clone-1-wo94.onrender.com/api/orders', orderPayload, config)
      .then((res) => {
        setIsSubmitting(false);
        if (res.data.success) {
          alert('🎉 Order finalized and saved successfully in database system history!');
          onOrderSuccess();
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        const serverErrorMsg = err.response?.data?.message || 'Failed to process transaction with database server endpoint.';
        setErrorMessage(serverErrorMsg);
      });
  };

  if (loading) return <h2 className="checkout-fallback-text">Loading Checkout manifest...</h2>;

  return (
    <div className="checkout-layout-view">
      <div className="checkout-main-content">
        
        {errorMessage && <div className="checkout-alert error">{errorMessage}</div>}

        <form onSubmit={handlePlaceOrder} className="checkout-address-form">
          
          {/*  HOME / BILLING ADDRESS */}
          <h1 className="checkout-step-title">1. Home / Billing Address</h1>
          <div className="checkout-billing-display">
            {homeAddress.addressLine1 ? (
              <>
                <p className="address-line-primary">{homeAddress.addressLine1}</p>
                {homeAddress.addressLine2 && <p>{homeAddress.addressLine2}</p>}
                <p>{homeAddress.city}, {homeAddress.state} {homeAddress.postalCode}</p>
                <p>{homeAddress.country}</p>
                {homeAddress.phoneNumber && <p className="address-phone">📞 {homeAddress.phoneNumber}</p>}
              </>
            ) : (
              <p className="no-address-fallback">No home address on file.</p>
            )}
          </div>

          {/* SYNC INTERLOCK CHECKBOX */}
          <div className="checkout-sync-checkbox-row">
            <input 
              type="checkbox" 
              id="checkoutShippingSameToggle"
              checked={shippingSameAsHome} 
              onChange={(e) => setShippingSameAsHome(e.target.checked)} 
            />
            <label htmlFor="checkoutShippingSameToggle">
              My Shipping Address is the same as my Home / Billing Address
            </label>
          </div>

          {/* SHIPPING DESTINATION */}
          <div className={`checkout-shipping-section-wrapper ${shippingSameAsHome ? 'disabled-view' : ''}`}>
            <h1 className="checkout-step-title">2. Review Shipping Address</h1>
            <div className="checkout-input-group">
              <label>Shipping Street Address</label>
              <input 
                type="text" 
                name="addressLine1" 
                value={shippingAddress.addressLine1} 
                onChange={handleAddressFieldChange} 
                disabled={shippingSameAsHome}
                required={!shippingSameAsHome} 
              />
              <input 
                type="text" 
                name="addressLine2" 
                value={shippingAddress.addressLine2} 
                onChange={handleAddressFieldChange} 
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="split-address-line"
                disabled={shippingSameAsHome}
              />
            </div>

            <div className="checkout-form-grid">
              <div className="checkout-input-group">
                <label>Shipping City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressFieldChange} disabled={shippingSameAsHome} required={!shippingSameAsHome} />
              </div>
              <div className="checkout-input-group">
                <label>Shipping State</label>
                <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressFieldChange} disabled={shippingSameAsHome} required={!shippingSameAsHome} />
              </div>
              <div className="checkout-input-group">
                <label>Shipping ZIP Code</label>
                <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressFieldChange} disabled={shippingSameAsHome} required={!shippingSameAsHome} />
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Shipping Phone Number</label>
              <input type="text" name="phoneNumber" value={shippingAddress.phoneNumber} onChange={handleAddressFieldChange} disabled={shippingSameAsHome} />
            </div>
          </div>

          {/* PAYMENT METHOD OPTION */}
          <h2 className="checkout-step-title secondary-step">3. Select Payment Method</h2>
          <div className="checkout-payment-selection-box">
            <div className="radio-option-row">
              <input 
                type="radio" 
                id="cod" 
                name="paymentMethod" 
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cod">
                💵 Cash on Delivery (COD)
              </label>
            </div>
          </div>

          {/* BASKET MANIFEST LIST */}
          <h2 className="checkout-step-title secondary-step">4. Review Items and Quantities</h2>
          <div className="checkout-items-list-box">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item-row">
                <img src={item.image} alt={item.name} />
                <div className="checkout-item-meta">
                  <h4>{item.name}</h4>
                  <span className="checkout-item-price-accent">{item.cost}</span>
                  <span className="checkout-item-qty">Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* Right Side Order Summary Panel */}
      <aside className="checkout-summary-sticky-panel">
        <button 
          type="submit" 
          disabled={isSubmitting || cartItems.length === 0 || !paymentMethod} 
          onClick={handlePlaceOrder} 
          className="checkout-place-order-btn"
        >
          {isSubmitting ? 'Processing Order...' : !paymentMethod ? 'Select Payment Method' : 'Place your order'}
        </button>
        <p className="checkout-fine-print">By placing your order, you agree to amazon.clone's conditions of use and privacy notice.</p>
        
        <div className="summary-breakdown-table">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((a, b) => a + b.quantity, 0)}):</span>
            <span>${itemsSubtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping & handling:</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="summary-row border-divider">
            <span>Estimated tax to be collected:</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>
          <div className="summary-row grand-total-row">
            <span>Order Total:</span>
            <span>${orderGrandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button type="button" onClick={onBackToCart} className="checkout-back-btn">Return to Basket</button>
      </aside>
    </div>
  );
}