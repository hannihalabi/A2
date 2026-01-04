'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { productsById } from '@/lib/products';

const CartContext = createContext(null);
const STORAGE_KEY = 'a2-cart';
const TAX_RATE = 0.08;

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT': {
      return { ...state, items: action.items };
    }
    case 'ADD': {
      const existing = state.items.find((item) => item.id === action.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { id: action.id, quantity: 1 }]
      };
    }
    case 'UPDATE': {
      const quantity = Math.max(0, action.quantity);
      if (quantity === 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.id)
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity } : item
        )
      };
    }
    case 'REMOVE': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id)
      };
    }
    case 'CLEAR': {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

function readStoredCart() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredCart();
    if (stored?.items) {
      dispatch({ type: 'INIT', items: stored.items });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
  }, [hydrated, state.items]);

  const lineItems = useMemo(() => {
    return state.items
      .map((item) => {
        const product = productsById[item.id];
        if (!product) return null;
        const quantity = Number(item.quantity) || 0;
        if (quantity <= 0) return null;
        return {
          ...product,
          quantity,
          lineTotal: product.price * quantity
        };
      })
      .filter(Boolean);
  }, [state.items]);

  const subtotal = useMemo(() => {
    return lineItems.reduce((total, item) => total + item.lineTotal, 0);
  }, [lineItems]);

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items: state.items,
    lineItems,
    subtotal,
    tax,
    total,
    itemCount,
    addItem: (id) => dispatch({ type: 'ADD', id }),
    updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE', id, quantity }),
    removeItem: (id) => dispatch({ type: 'REMOVE', id }),
    clearCart: () => dispatch({ type: 'CLEAR' })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
