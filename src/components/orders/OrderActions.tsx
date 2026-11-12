import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { Eye, History, MoreVertical, Pencil, RefreshCw } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import type { ProductionOrder } from '../../types/production';
import { getOrdersText } from '../../utils/ordersText';
import { getAllowedTransitions } from '../../utils/workflow';

interface OrderActionsProps {
  order: ProductionOrder;
  onChangeStatus: (order: ProductionOrder) => void;
}

export function OrderActions({ order, onChangeStatus }: OrderActionsProps) {
  const navigate = useNavigate();
  const { locale, dir } = useI18n();
  const text = getOrdersText(locale);
  const side = dir === 'rtl' ? 'left' : 'right';
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const canChangeStatus = getAllowedTransitions(order.status).length > 0;

  const close = () => setAnchor(null);
  const open = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
  };
  const run = (action: () => void) => () => {
    close();
    action();
  };

  return (
    <>
      <Tooltip title={text.orderActions}>
        <IconButton
          size="small"
          onClick={open}
          aria-label={text.actionsFor(order.poNumber)}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
        >
          <MoreVertical size={18} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        onClick={(event) => event.stopPropagation()}
        // Physical sides: the menu opens toward the inside of the table in both directions.
        anchorOrigin={{ vertical: 'bottom', horizontal: side }}
        transformOrigin={{ vertical: 'top', horizontal: side }}
      >
        <MenuItem onClick={run(() => navigate(`/production/orders/${order.id}`))}>
          <ListItemIcon>
            <Eye size={16} />
          </ListItemIcon>
          <ListItemText>{text.viewOrder}</ListItemText>
        </MenuItem>
        <MenuItem onClick={run(() => navigate(`/production/work-orders/${order.id}/edit`))}>
          <ListItemIcon>
            <Pencil size={16} />
          </ListItemIcon>
          <ListItemText>{text.editOrder}</ListItemText>
        </MenuItem>
        <MenuItem disabled={!canChangeStatus} onClick={run(() => onChangeStatus(order))}>
          <ListItemIcon>
            <RefreshCw size={16} />
          </ListItemIcon>
          <ListItemText>{text.changeStatus}</ListItemText>
        </MenuItem>
        <MenuItem onClick={run(() => navigate(`/production/orders/${order.id}#history`))}>
          <ListItemIcon>
            <History size={16} />
          </ListItemIcon>
          <ListItemText>{text.viewHistory}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
