import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign browser ResizeObserver cycle limitation warnings that occur during rapid vertical or horizontal scrolls
if (typeof window !== 'undefined') {
  const resizeObserverErrorMsgs = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications'
  ];
  
  window.addEventListener('error', (event) => {
    if (resizeObserverErrorMsgs.some(msg => event.message && event.message.includes(msg))) {
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
