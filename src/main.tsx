import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import LossesPage from './pages/LossesPage.tsx';
import CasesPage from './pages/CasesPage.tsx';
import RefundPage from './pages/RefundPage.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/pencatatan-kerugian',
    element: <LossesPage />,
  },
  {
    path: '/pengelolaan-kasus-tgr',
    element: <CasesPage />,
  },
  {
    path: '/mekanisme-pengembalian',
    element: <RefundPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);