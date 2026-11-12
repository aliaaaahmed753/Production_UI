import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { Filter, FilterX, Search } from 'lucide-react';
import { getStatusOptions } from '../../config/statusConfig';
import { useI18n } from '../../contexts/I18nContext';
import type { OrderFilterValues } from '../../types/production';
import { getOrdersText } from '../../utils/ordersText';
import { countActiveFilters, hasAnyFilter } from '../../utils/orderMetrics';

interface OrderFiltersProps {
  /** Applied filters (what the table currently shows). */
  value: OrderFilterValues;
  clients: readonly string[];
  colors: readonly string[];
  onChange: (next: OrderFilterValues) => void;
  onClear: () => void;
}

interface FilterSelectProps {
  /** Stable id fragment; the visible label can be in any language. */
  name: string;
  label: string;
  value: string;
  allLabel: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterSelect({ name, label, value, allLabel, options, onChange }: FilterSelectProps) {
  const id = `filter-${name}`;
  return (
    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 }, flex: { sm: '0 1 180px' } }}>
      <InputLabel id={`${id}-label`} shrink>
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        value={value}
        displayEmpty
        notched
        onChange={(event) => onChange(event.target.value)}
      >
        <MenuItem value="">{allLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function OrderFilters({ value, clients, colors, onChange, onClear }: OrderFiltersProps) {
  const { locale } = useI18n();
  const text = getOrdersText(locale);
  // Search applies as you type; the dropdown / date filters apply with the Filter button.
  const [draft, setDraft] = useState(value);

  // Re-sync the draft when applied filters change (e.g. Clear), but not on every
  // keystroke in the search box — that would discard unapplied dropdown choices.
  useEffect(() => {
    setDraft((previous) => ({
      ...previous,
      client: value.client,
      status: value.status,
      color: value.color,
      dateFrom: value.dateFrom,
      dateTo: value.dateTo,
    }));
  }, [value.client, value.status, value.color, value.dateFrom, value.dateTo]);

  const rangeInvalid = Boolean(draft.dateFrom && draft.dateTo && draft.dateFrom > draft.dateTo);
  const draftDiffers =
    draft.client !== value.client ||
    draft.status !== value.status ||
    draft.color !== value.color ||
    draft.dateFrom !== value.dateFrom ||
    draft.dateTo !== value.dateTo;
  const activeCount = countActiveFilters(value);

  const apply = () => {
    if (rangeInvalid) return;
    onChange({ ...value, ...draft, search: value.search });
  };

  const patch = (changes: Partial<OrderFilterValues>) => setDraft((previous) => ({ ...previous, ...changes }));

  return (
    <Paper
      component="form"
      role="search"
      aria-label={text.filterOrders}
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
      sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}
    >
      <TextField
        size="small"
        value={value.search}
        onChange={(event) => onChange({ ...value, search: event.target.value })}
        placeholder={text.searchPlaceholder}
        inputProps={{ 'aria-label': text.searchLabel }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} aria-hidden />
            </InputAdornment>
          ),
        }}
        sx={{ flex: '1 1 260px', minWidth: { xs: '100%', sm: 260 } }}
      />

      <FilterSelect
        name="client"
        label={text.client}
        value={draft.client}
        allLabel={text.allClients}
        options={clients.map((client) => ({ value: client, label: client }))}
        onChange={(client) => patch({ client })}
      />
      <FilterSelect
        name="status"
        label={text.orderStatus}
        value={draft.status}
        allLabel={text.allStatuses}
        options={getStatusOptions(locale)}
        onChange={(status) => patch({ status: status as OrderFilterValues['status'] })}
      />
      <FilterSelect
        name="color"
        label={text.color}
        value={draft.color}
        allLabel={text.allColors}
        options={colors.map((color) => ({ value: color, label: color }))}
        onChange={(color) => patch({ color })}
      />

      <Box sx={{ display: 'flex', gap: 1, flex: { xs: '1 1 100%', md: '0 1 auto' } }}>
        <TextField
          size="small"
          type="date"
          label={text.from}
          value={draft.dateFrom}
          onChange={(event) => patch({ dateFrom: event.target.value })}
          error={rangeInvalid}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, minWidth: 140 }}
        />
        <TextField
          size="small"
          type="date"
          label={text.to}
          value={draft.dateTo}
          onChange={(event) => patch({ dateTo: event.target.value })}
          error={rangeInvalid}
          helperText={rangeInvalid ? text.rangeInvalid : undefined}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, minWidth: 140 }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, ml: { md: 'auto' } }}>
        <Badge color="secondary" badgeContent={activeCount} invisible={activeCount === 0}>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            startIcon={<Filter size={16} />}
            disabled={rangeInvalid || !draftDiffers}
          >
            {text.filter}
          </Button>
        </Badge>
        <Button
          variant="text"
          color="inherit"
          startIcon={<FilterX size={16} />}
          onClick={onClear}
          disabled={!hasAnyFilter(value) && !draftDiffers}
          sx={{ color: 'text.secondary' }}
        >
          {text.clearFilters}
        </Button>
      </Box>
    </Paper>
  );
}
