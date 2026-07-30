// Polyfill/safety patch for window.fetch in iframe environments where window.fetch is getter-only
(function initFetchPolyfill() {
  if (typeof window !== 'undefined') {
    try {
      let currentFetch = window.fetch ? window.fetch.bind(window) : undefined;
      const proto = Object.getPrototypeOf(window);
      const desc = Object.getOwnPropertyDescriptor(window, 'fetch') || (proto && Object.getOwnPropertyDescriptor(proto, 'fetch'));
      
      if (!desc || (desc.get && !desc.set)) {
        Object.defineProperty(window, 'fetch', {
          get() {
            return currentFetch;
          },
          set(fn) {
            currentFetch = fn;
          },
          configurable: true,
          enumerable: true,
        });
      }
    } catch (e) {
      console.warn('Could not patch window.fetch setter:', e);
    }
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

