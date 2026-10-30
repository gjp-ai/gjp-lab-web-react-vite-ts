import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { prepareApplication } from '@/app/prepare';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import './app/styles.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('The application root element was not found.');
}

void prepareApplication()
  .then(() => {
    createRoot(root).render(
      <StrictMode>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </StrictMode>,
    );
  })
  .catch((error: unknown) => {
    root.textContent = 'The application could not start. Please reload the page.';
    console.error('Application initialization failed.', error);
  });
