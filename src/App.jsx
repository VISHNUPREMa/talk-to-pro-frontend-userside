import React, { useEffect } from 'react';

import './App.css';
import Routers from './router/router.jsx';
import { AuthProvider } from './pages/user/usercomponents/jwtAuthContext.jsx';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <AuthProvider>
      <Routers />
    </AuthProvider>
  );
}

export default App;
