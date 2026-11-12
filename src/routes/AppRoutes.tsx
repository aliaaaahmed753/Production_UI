import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import NotFoundPage from '../pages/NotFoundPage';
import PlaceholderPage from '../pages/PlaceholderPage';
import LoginPage from '../pages/LoginPage';
import EditWorkOrderPage from '../pages/production/EditWorkOrderPage';
import NewWorkOrderPage from '../pages/production/NewWorkOrderPage';
import OrderDetailsPage from '../pages/production/OrderDetailsPage';
import ProductionOrdersPage from '../pages/production/ProductionOrdersPage';
import { useAuth } from '../contexts/AuthContext';

/** Modules that exist in the navigation but are built in later phases. */
const PLACEHOLDER_ROUTES: { path: string; title: string; titleAr: string }[] = [
  { path: '/dashboard', title: 'Dashboard', titleAr: 'لوحة التحكم' },
  { path: '/clients', title: 'Clients', titleAr: 'العملاء' },
  { path: '/production/cutting', title: 'Cutting', titleAr: 'القص' },
  { path: '/production/sorting', title: 'Sorting', titleAr: 'الفرز والترقيم' },
  { path: '/production/sewing', title: 'Sewing', titleAr: 'الخياطة والتجميع' },
  { path: '/production/ironing', title: 'Ironing', titleAr: 'الكي' },
  { path: '/production/packing', title: 'Packing', titleAr: 'التعبئة' },
  { path: '/production/qc', title: 'Quality Check', titleAr: 'فحص الجودة' },
  { path: '/inventory', title: 'Inventory', titleAr: 'المخازن' },
  { path: '/reports', title: 'Reports', titleAr: 'التقارير' },
  { path: '/settings', title: 'Settings', titleAr: 'الإعدادات' },
];

/** Old edit links (/production/orders/:id/edit) now open the work order form. */
function RedirectToWorkOrderEdit() {
  const { id = '' } = useParams<{ id: string }>();
  return <Navigate to={`/production/work-orders/${id}/edit`} replace />;
}

/** Wraps protected routes — redirects to /login if not authenticated. */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/production/orders" replace /> : <LoginPage />}
      />

      {/* Protected — all routes inside AppLayout */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/production/orders" replace />} />
        <Route path="/production" element={<Navigate to="/production/orders" replace />} />
        <Route path="/production/orders" element={<ProductionOrdersPage />} />
        {/* `new` is declared before `:id` so it is never read as an order id. */}
        <Route path="/production/orders/new" element={<NewWorkOrderPage />} />
        <Route path="/production/work-orders/:id/edit" element={<EditWorkOrderPage />} />
        <Route path="/production/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/production/orders/:id/edit" element={<RedirectToWorkOrderEdit />} />
        {PLACEHOLDER_ROUTES.map(({ path, title, titleAr }) => (
          <Route key={path} path={path} element={<PlaceholderPage title={title} titleAr={titleAr} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
