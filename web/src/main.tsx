import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/scss/index.scss';
import { ToastProvider } from './ToastProvider.tsx';
import { ModalProvider } from './components/actions/modal/ModalProvider.tsx';

declare global {
  interface Window {
    TresorPay?: { init: (...args: unknown[]) => void };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ModalProvider>
  </React.StrictMode>,
);
