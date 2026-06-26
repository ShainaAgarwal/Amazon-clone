import { configureStore, createSlice } from '@reduxjs/toolkit';



const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('amazonUser'));
  } catch {
    return null;
  }
};

const getTokenFromStorage = () => {
  try {
    return localStorage.getItem('amazonToken');
  } catch {
    return null;
  }
};

const getCartFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('amazonCart')) || [];
  } catch {
    return [];
  }
};



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    
    userInfo: getUserFromStorage(),
    token: getTokenFromStorage(),
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;

      
      state.userInfo = { ...user, token };
      state.token = token;

      localStorage.setItem('amazonUser', JSON.stringify(state.userInfo));
      localStorage.setItem('amazonToken', token);
    },

    logout: (state) => {
      state.userInfo = null;
      state.token = null;

      localStorage.removeItem('amazonUser');
      localStorage.removeItem('amazonToken');
    },
  },
});



const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromStorage(),
  },

  reducers: {
    addItem: (state, action) => {
      const { id, name, image, cost } = action.payload;

      const existingItem = state.items.find(
        item => item.id === id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id,
          name,
          image,
          cost,
          quantity: 1,
        });
      }

      localStorage.setItem(
        'amazonCart',
        JSON.stringify(state.items)
      );
    },

    removeItem: (state, action) => {
      const id = action.payload;

      state.items = state.items.filter(
        item => item.id !== id
      );

      localStorage.setItem(
        'amazonCart',
        JSON.stringify(state.items)
      );
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.items.find(
        item => item.id === id
      );

      if (item) {
        item.quantity = Math.max(1, quantity);
      }

      localStorage.setItem(
        'amazonCart',
        JSON.stringify(state.items)
      );
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('amazonCart');
    },
  },
});



export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} = cartSlice.actions;



export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
  },
});