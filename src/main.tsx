import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeIndexedDB } from './services/initializeDb';

// Initialize IndexedDB with sample data
initializeIndexedDB();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
