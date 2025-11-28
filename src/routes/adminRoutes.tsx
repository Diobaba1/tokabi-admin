// ============================================================================
// src/routes/adminRoutes.tsx
// ============================================================================

import { RouteObject } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminGuard from '../components/guards/AdminGuard';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Trades from '../pages/admin/Trades';
import Subscriptions from '../pages/admin/Subscriptions';
import Signals from '../pages/admin/Signals';
import Analytics from '../pages/admin/Analytics';
import { APIKeys } from '../pages/admin/APIKeys';
import Portfolios  from '../pages/admin/Portfolios';
import Affiliates from '../pages/admin/Affiliates';
import Referrals from '../pages/admin/Referrals';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'trades',
        element: <Trades />,
      },
      {
        path: 'subscriptions',
        element: <Subscriptions />,
      },
      {
        path: 'signals',
        element: <Signals />,
      },
      {
        path: 'referrals',
        element: <Referrals />,
      },
      {
        path: 'affiliates',
        element: <Affiliates />,
      },
      {
        path: 'portfolios',
        element: <Portfolios />,
      },
      {
        path: 'api-keys',
        element: <APIKeys />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
    ],
  },
];
