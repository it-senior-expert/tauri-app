import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import FXDTheme from '@/components/Common/theme/theme';
import App from './App';

// Get the root element from the DOM
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

// Initialize the React root
const root = createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <ChakraProvider resetCSS theme={FXDTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
