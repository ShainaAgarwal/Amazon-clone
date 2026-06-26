import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../store';
import './CartItem.css'; 

export default function Cart({ onContinueShopping, onProceedToCheckout }) {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.cost.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleIncrement = (item) => {
    dispatch(updateQuantity({
      id: item.id,
      quantity: item.quantity + 1
    }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({
        id: item.id,
        quantity: item.quantity - 1
      }));
    } else {
      dispatch(removeItem(item.id));
    }
  };

  const calculateTotalCost = (item) => {
    const price = parseFloat(item.cost.replace('$', ''));
    return (price * item.quantity).toFixed(2);
  };

  return (
    <div className="cart-container">
      {cart.length === 0 ? (
        
        <div className="empty-cart-message">
          <h3>Your Shopping Basket is empty.</h3>
          <button className="amazon-btn continue-shopping-btn" onClick={onContinueShopping}>
            Go Shop Items
          </button>
        </div>
      ) : (
        
        <div className="cart-layout-grid">
          
          {/* LEFT COLUMN: THE CORE ITEMS CARD */}
          <div className="cart-main-content-block">
            <h2 className="cart-total-header">Shopping Cart</h2>
            <div className="cart-items-wrapper">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-image-frame">
                    <img className="cart-item-image" src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-cost">{item.cost}</div>

                    <div className="cart-item-quantity-row">
                      <button className="qty-adjust-btn" onClick={() => handleDecrement(item)}>-</button>
                      <span className="cart-item-quantity-value">{item.quantity}</span>
                      <button className="qty-adjust-btn" onClick={() => handleIncrement(item)}>+</button>
                      
                      <button className="cart-delete-btn" onClick={() => dispatch(removeItem(item.id))}>
                        Delete
                      </button>
                    </div>

                    <div className="cart-item-total">
                      Subtotal: <strong>${calculateTotalCost(item)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: CHECKOUT SIDEBAR */}
          <div className="cart-sidebar-summary-block">
            <div className="cart-total">
              Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items): <strong>${calculateTotalAmount()}</strong>
            </div>
            <div className="cart-actions-footer">
              <button className="amazon-btn checkout-prime-btn" onClick={onProceedToCheckout}>
                Proceed to Checkout
              </button>
              <button className="amazon-btn continue-shopping-btn" onClick={onContinueShopping}>
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}