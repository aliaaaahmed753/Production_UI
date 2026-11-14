import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AccessoryBasis, AccessorySection, AccessorySource, AccessoryUnit } from '../../types/workOrder';
import { formatNumber } from '../../utils/format';
import { calculateAccessory, calculateWorkOrderTotals } from '../../utils/workOrderCalc';
import {
  ACCESSORY_SOURCES,
  ACCESSORY_UNITS,
  colorRowToLine,
  newAccessoryRow,
  toNumber,
  type AccessoryRow,
  type ColorRow,
  type FormText,
  type SizeRow,
} from '../../utils/workOrderForm';
import { SectionCard } from '../common/SectionCard';

interface Props {
  text: FormText;
  section: AccessorySection;
  sizes: SizeRow[];
  colors: ColorRow[];
  /** All accessories of the order (both sections); this card edits only its own section. */
  accessories: AccessoryRow[];
  errors: Record<string, string>;
  onChange: (accessories: AccessoryRow[]) => void;
}

const headCellSx = { fontWeight: 600, whiteSpace: 'nowrap' } as const;

/** Operation or packing accessories. Quantity = garments x (accessories / garments), rounded up. */
export function WorkOrderAccessoriesSection({ text, section, sizes, colors, accessories, errors, onChange }: Props) {
  const sizeIds = sizes.map((size) => size.id);
  const totals = calculateWorkOrderTotals({
    sizes: sizeIds,
    colors: colors.map((row) => colorRowToLine(row, sizeIds)),
    pos: [],
  });

  // نسبة الزيادة على مستوى القسم كله (state محلي)
  const [sectionExtraPercent, setSectionExtraPercent] = useState('');

  const mine = accessories.filter((row) => row.section === section);
  const patch = (id: string, change: Partial<AccessoryRow>) =>
    onChange(accessories.map((row) => (row.id === id ? { ...row, ...change } : row)));

  const sourceLabel: Record<AccessorySource, string> = {
    LOCAL: text.srcLocal,
    IMPORTED: text.srcImported,
    NOMINATED: text.srcNominated,
  };

  // helper لحساب الكمية بدون زيادة
  const baseResult = (row: AccessoryRow) =>
    calculateAccessory(
      {
        accessoryQty: toNumber(row.accessoryQty),
        garmentQty: toNumber(row.garmentQty),
        basis: row.basis,
        bySize: row.bySize,
      },
      totals,
      sizeIds,
    );

  // نسبة الزيادة المدخلة
  const extraPercentParsed = sectionExtraPercent.trim() === '' ? 0 : toNumber(sectionExtraPercent);
  const extraPercent = Number.isFinite(extraPercentParsed) && extraPercentParsed > 0 ? extraPercentParsed : 0;

  /** إزالة ضوضاء floating point */
  const cleanUp = (v: number) => Math.round(v * 1_000_000) / 1_000_000;

  /** تطبيق نسبة الزيادة على النتيجة الأساسية */
  const applyExtra = (base: ReturnType<typeof calculateAccessory>, pct: number, row: AccessoryRow) => {
    if (pct <= 0) return base;
    const factor = 1 + pct / 100;
    const perSize: Record<string, number> = {};
    for (const id of sizeIds) {
      perSize[id] = Math.ceil(cleanUp((base.perSize[id] ?? 0) * factor));
    }
    const total = row.bySize
      ? sizeIds.reduce((sum, id) => sum + perSize[id], 0)
      : Math.ceil(cleanUp(base.total * factor));
    return { perSize, total };
  };

  const withExtraResult = (row: AccessoryRow) => {
    const base = baseResult(row);
    return applyExtra(base, extraPercent, row);
  };

  return (
    <SectionCard
      title={section === 'OPERATION' ? text.secAccOperation : text.secAccPacking}
      description={text.secAccDesc}
    >
      {/* حقل نسبة الزيادة على مستوى القسم */}
      <Box sx={{ mb: 2, maxWidth: 220 }}>
        <TextField
          type="number"
          label={text.extra}
          value={sectionExtraPercent}
          onChange={(event) => setSectionExtraPercent(event.target.value)}
          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          inputProps={{ min: 0, step: 'any' }}
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mine.map((row) => {
          const base = baseResult(row);
          const withExtra = withExtraResult(row);
          const nameError = errors[`accessories.${row.id}.name`];
          const ratioError = errors[`accessories.${row.id}.ratio`];
          return (
            <Box
              key={row.id}
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr)) 40px' },
                alignItems: 'start',
                p: 1.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <TextField
                required
                label={text.accessory}
                value={row.name}
                onChange={(event) => patch(row.id, { name: event.target.value })}
                error={Boolean(nameError)}
                helperText={nameError}
              />
              <TextField
                label={text.accSpec}
                placeholder={text.accSpecHint}
                value={row.spec}
                onChange={(event) => patch(row.id, { spec: event.target.value })}
              />
              <FormControl>
                <InputLabel id={`acc-unit-${row.id}`}>{text.accUnit}</InputLabel>
                <Select
                  labelId={`acc-unit-${row.id}`}
                  label={text.accUnit}
                  value={row.unit}
                  onChange={(event) => patch(row.id, { unit: event.target.value as AccessoryUnit })}
                >
                  {ACCESSORY_UNITS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id={`acc-source-${row.id}`}>{text.accSource}</InputLabel>
                <Select
                  labelId={`acc-source-${row.id}`}
                  label={text.accSource}
                  value={row.source}
                  onChange={(event) => patch(row.id, { source: event.target.value as AccessorySource })}
                >
                  {ACCESSORY_SOURCES.map((source) => (
                    <MenuItem key={source} value={source}>
                      {sourceLabel[source]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title={text.remove}>
                <IconButton
                  aria-label={text.remove}
                  onClick={() => onChange(accessories.filter((candidate) => candidate.id !== row.id))}
                  sx={{ mt: 0.5 }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>

              <TextField
                required
                type="number"
                label={text.accQty}
                value={row.accessoryQty}
                onChange={(event) => patch(row.id, { accessoryQty: event.target.value })}
                error={Boolean(ratioError)}
                helperText={ratioError}
                inputProps={{ min: 0, step: 'any' }}
              />
              <TextField
                required
                type="number"
                label={text.accPer}
                value={row.garmentQty}
                onChange={(event) => patch(row.id, { garmentQty: event.target.value })}
                error={Boolean(ratioError)}
                inputProps={{ min: 0, step: 'any' }}
              />
              <FormControl>
                <InputLabel id={`acc-basis-${row.id}`}>{text.accBasis}</InputLabel>
                <Select
                  labelId={`acc-basis-${row.id}`}
                  label={text.accBasis}
                  value={row.basis}
                  onChange={(event) => patch(row.id, { basis: event.target.value as AccessoryBasis })}
                >
                  <MenuItem value="ORDER">{text.basisOrder}</MenuItem>
                  <MenuItem value="CUT">{text.basisCut}</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                label={text.accBySize}
                sx={{ mt: 0.75 }}
                control={
                  <Checkbox
                    checked={row.bySize}
                    onChange={(event) => patch(row.id, { bySize: event.target.checked })}
                  />
                }
              />

              {/* جدول الكمية: صف الكمية الأساسية + صف الزيادة */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Box sx={{ overflowX: 'auto', mt: 0.5 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headCellSx} />
                        {sizes.map((size) => (
                          <TableCell key={size.id} align="center" sx={headCellSx}>
                            {size.label.trim() || '—'}
                          </TableCell>
                        ))}
                        <TableCell align="center" sx={headCellSx}>
                          {text.accTotal}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* صف الكمية الأساسية (بدون زيادة) */}
                      <TableRow>
                        <TableCell sx={{ ...headCellSx, color: 'text.secondary', fontSize: '0.75rem' }}>
                          {text.quantityCol}
                        </TableCell>
                        {sizes.map((size) => (
                          <TableCell key={size.id} align="center">
                            {formatNumber(base.perSize[size.id] ?? 0)}
                          </TableCell>
                        ))}
                        <TableCell align="center">
                          {formatNumber(base.total)} {row.unit}
                        </TableCell>
                      </TableRow>

                      {/* صف الكمية بعد الزيادة (يظهر فقط لو extraPercent > 0) */}
                      {extraPercent > 0 && (
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell sx={{ ...headCellSx, color: 'primary.main', fontSize: '0.75rem' }}>
                            + {formatNumber(extraPercent)}%
                          </TableCell>
                          {sizes.map((size) => (
                            <TableCell key={size.id} align="center" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {formatNumber(withExtra.perSize[size.id] ?? 0)}
                            </TableCell>
                          ))}
                          <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {formatNumber(withExtra.total)} {row.unit}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Box>
          );
        })}
        <Box>
          <Button startIcon={<Plus size={16} />} onClick={() => onChange([...accessories, newAccessoryRow(section)])}>
            {text.addAccessory}
          </Button>
        </Box>
      </Box>
    </SectionCard>
  );
}
