import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Paper, Snackbar } from '@mui/material';
import { ClipboardList, Download, Plus, SearchX } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PageHeader } from '../../components/common/PageHeader';
import { ChangeStatusDialog } from '../../components/orders/ChangeStatusDialog';
import { OrderFilters } from '../../components/orders/OrderFilters';
import { OrderSummaryCards } from '../../components/orders/OrderSummaryCards';
import { OrderTable } from '../../components/orders/OrderTable';
import { statusLabel } from '../../config/statusConfig';
import { useI18n } from '../../contexts/I18nContext';
import { useProductionOrders } from '../../hooks/useProductionOrders';
import { changeOrderStatus } from '../../services/productionOrdersService';
import type { OrderFilterValues, ProductionOrder, ProductionStatus } from '../../types/production';
import { downloadOrdersCsv } from '../../utils/exportCsv';
import { todayIso } from '../../utils/format';
import { getOrdersText } from '../../utils/ordersText';
import {
  EMPTY_FILTERS,
  filterOrders,
  getFilterOptions,
  getOrderSummary,
  hasAnyFilter,
} from '../../utils/orderMetrics';

export default function ProductionOrdersPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const text = getOrdersText(locale);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const { data, error, loading, reload } = useProductionOrders();
  const [filters, setFilters] = useState<OrderFilterValues>({ ...EMPTY_FILTERS, search: urlQuery });
  const [statusTarget, setStatusTarget] = useState<ProductionOrder | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // The top bar search navigates here with ?q=…; keep the toolbar in sync with it.
  useEffect(() => {
    setFilters((previous) => (previous.search === urlQuery ? previous : { ...previous, search: urlQuery }));
  }, [urlQuery]);

  const orders = useMemo(() => data ?? [], [data]);
  const summary = useMemo(() => getOrderSummary(orders), [orders]);
  const options = useMemo(() => getFilterOptions(orders), [orders]);
  const filtered = useMemo(() => filterOrders(orders, filters), [orders, filters]);

  const handleFiltersChange = (next: OrderFilterValues) => {
    setFilters(next);
    if (next.search !== urlQuery) {
      setSearchParams(next.search ? { q: next.search } : {}, { replace: true });
    }
  };
  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    setSearchParams({}, { replace: true });
  };

  const handleStatusConfirm = async (order: ProductionOrder, status: ProductionStatus, note: string) => {
    await changeOrderStatus(order.id, status, note);
    setToast(text.movedTo(order.poNumber, statusLabel(status, locale)));
    reload();
  };

  const handleExport = () => downloadOrdersCsv(filtered, `production-orders-${todayIso()}.csv`);

  const showInitialLoading = loading && !data;

  let content;
  if (error && !data) {
    content = (
      <Paper>
        <ErrorState message={text.loadError} onRetry={reload} />
      </Paper>
    );
  } else if (showInitialLoading) {
    content = <OrderTable orders={[]} loading onChangeStatus={setStatusTarget} />;
  } else if (orders.length === 0) {
    content = (
      <Paper>
        <EmptyState
          icon={ClipboardList}
          title={text.emptyTitle}
          message={text.emptyMessage}
          action={
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => navigate('/production/orders/new')}>
              {text.newOrder}
            </Button>
          }
        />
      </Paper>
    );
  } else if (filtered.length === 0) {
    content = (
      <Paper>
        <EmptyState
          icon={SearchX}
          title={text.noMatchTitle}
          message={text.noMatchMessage}
          action={
            hasAnyFilter(filters) ? (
              <Button variant="outlined" onClick={handleClear}>
                {text.clearFilters}
              </Button>
            ) : undefined
          }
        />
      </Paper>
    );
  } else {
    content = <OrderTable orders={filtered} onChangeStatus={setStatusTarget} />;
  }

  return (
    <>
      <PageHeader
        title={text.pageTitle}
        subtitle={text.pageSubtitle}
        actions={
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Download size={16} />}
              onClick={handleExport}
              disabled={filtered.length === 0}
            >
              {text.export}
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => navigate('/production/orders/new')}
              sx={{ px: 2.25 }}
            >
              {text.newOrder}
            </Button>
          </>
        }
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <OrderSummaryCards summary={summary} loading={showInitialLoading} />
        <OrderFilters
          value={filters}
          clients={options.clients}
          colors={options.colors}
          onChange={handleFiltersChange}
          onClear={handleClear}
        />
        {error && data && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>{text.retry}</Button>}>
            {text.refreshError}
          </Alert>
        )}
        {content}
      </Box>

      <ChangeStatusDialog order={statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleStatusConfirm} />
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
