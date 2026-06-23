import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SettingsProvider } from './contexts/SettingsContext';
import { SEOProvider } from './contexts/SEOContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <SEOProvider>
        <App />
      </SEOProvider>
    </SettingsProvider>
  </StrictMode>
);
