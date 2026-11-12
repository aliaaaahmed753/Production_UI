import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { statusDescription, statusLabel } from '../../config/statusConfig';
import { useI18n } from '../../contexts/I18nContext';
import type { ProductionOrder, ProductionStatus } from '../../types/production';
import { getOrdersText } from '../../utils/ordersText';
import { getAllowedTransitions, getTransitionHint } from '../../utils/workflow';
import { OrderStatusBadge } from './OrderStatusBadge';

interface ChangeStatusDialogProps {
  /** The order being changed; the dialog is open while this is set. */
  order: ProductionOrder | null;
  onClose: () => void;
  onConfirm: (order: ProductionOrder, status: ProductionStatus, note: string) => Promise<void>;
}

export function ChangeStatusDialog({ order, onClose, onConfirm }: ChangeStatusDialogProps) {
  const { locale } = useI18n();
  const text = getOrdersText(locale);
  const [target, setTarget] = useState<ProductionStatus | ''>('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
    const [first] = getAllowedTransitions(order.status);
    // Pre-select only when there is a single obvious next step.
    setTarget(getAllowedTransitions(order.status).length === 1 ? first : '');
    setNote('');
    setError(null);
    setSubmitting(false);
  }, [order]);

  const allowed = order ? getAllowedTransitions(order.status) : [];
  const hint = target ? (getTransitionHint(target, locale) ?? statusDescription(target, locale)) : undefined;

  const handleConfirm = async () => {
    if (!order || !target) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(order, target, note);
      onClose();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : text.statusFailed);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(order)} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>{text.changeStatus}</DialogTitle>
      <DialogContent>
        {order && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {order.poNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {text.current}
              </Typography>
              <OrderStatusBadge status={order.status} />
            </Box>

            {allowed.length === 0 ? (
              <Alert severity="info">{text.completedInfo}</Alert>
            ) : (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel id="next-status-label">{text.moveTo}</InputLabel>
                  <Select
                    labelId="next-status-label"
                    label={text.moveTo}
                    value={target}
                    onChange={(event) => setTarget(event.target.value as ProductionStatus)}
                  >
                    {allowed.map((status) => (
                      <MenuItem key={status} value={status}>
                        {statusLabel(status, locale)}
                      </MenuItem>
                    ))}
                  </Select>
                  {hint && <FormHelperText>{hint}</FormHelperText>}
                </FormControl>
                <TextField
                  size="small"
                  label={text.noteOptional}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                />
              </>
            )}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={submitting}>
          {text.cancel}
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!target || submitting}>
          {submitting ? text.saving : text.changeStatus}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
