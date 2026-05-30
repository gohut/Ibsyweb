"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { cartSeed } from "@/lib/mock-data";
import { detectCurrencyClient, type Currency } from "@/lib/currency";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error";
};

type AppStateValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  cartItems: string[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const CART_STORAGE_KEY = "royal-vault-cart";
const CURRENCY_STORAGE_KEY = "royal-vault-currency";
// Only written when the USER manually picks a currency
const CURRENCY_MANUAL_KEY = "royal-vault-currency-manual";

export function AppStateProvider({ children }: PropsWithChildren) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [cartItems, setCartItems] = useState<string[]>(cartSeed);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const wasManuallySet = window.localStorage.getItem(CURRENCY_MANUAL_KEY) === "1";

    if (!wasManuallySet) {
      // No manual choice — always auto-detect from timezone, ignore any saved value
      window.localStorage.removeItem(CURRENCY_STORAGE_KEY);
      setCurrencyState(detectCurrencyClient());
    } else {
      const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null;
      setCurrencyState(saved ?? detectCurrencyClient());
    }

    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as string[];
        setCartItems(parsed);
      } catch {
        setCartItems(cartSeed);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const value = useMemo<AppStateValue>(
    () => ({
      currency,
      setCurrency: (next: Currency) => {
        // Mark as manually chosen — auto-detect skipped on future visits
        setCurrencyState(next);
        window.localStorage.setItem(CURRENCY_STORAGE_KEY, next);
        window.localStorage.setItem(CURRENCY_MANUAL_KEY, "1");
      },
      cartItems,
      addToCart: (productId) => {
        setCartItems((current) => {
          if (current.includes(productId)) return current;
          return [...current, productId];
        });
        showToast("Added to cart.");
      },
      removeFromCart: (productId) => {
        setCartItems((current) =>
          current.filter((item) => item !== productId),
        );
        showToast("Removed from cart.");
      },
      showToast,
    }),
    [cartItems, currency],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`} role="status">
            {toast.message}
          </div>
        ))}
      </div>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}