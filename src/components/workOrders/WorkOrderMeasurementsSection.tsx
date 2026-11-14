import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import {
  measurementCode,
  newMeasureRow,
  type FormText,
  type MeasureRow,
  type SizeRow,
} from '../../utils/workOrderForm';
import type { MeasurementUnit } from '../../types/workOrder';
import { SectionCard } from '../common/SectionCard';

interface Props {
  text: FormText;
  sizes: SizeRow[];
  measurements: MeasureRow[];
  unit: MeasurementUnit;
  onChange: (measurements: MeasureRow[]) => void;
  onUnitChange: (unit: MeasurementUnit) => void;
}

const headCellSx = { fontWeight: 600, whiteSpace: 'nowrap', fontSize: '101%' } as const;

/** Optional measurement chart: each dimension, how it is measured (from / to) and a value per size. */
export function WorkOrderMeasurementsSection({ text, sizes, measurements, unit, onChange, onUnitChange }: Props) {
  const patch = (id: string, change: Partial<MeasureRow>) =>
    onChange(measurements.map((row) => (row.id === id ? { ...row, ...change } : row)));
  const setValue = (row: MeasureRow, sizeId: string, value: string) =>
    patch(row.id, { values: { ...row.values, [sizeId]: value } });

  const unitLabel = unit === 'in' ? text.unitIn : text.unitCm;

  return (
    <SectionCard title={text.secMeasures} description={text.secMeasuresDesc} flush>
      {measurements.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx} />
                <TableCell sx={headCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {text.measureName}
                    {/* The unit is a label for the whole table; typed values are never converted. */}
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      color="primary"
                      value={unit}
                      onChange={(_, next: MeasurementUnit | null) => next && onUnitChange(next)}
                      aria-label={text.measureUnit}
                    >
                      <ToggleButton value="in" sx={{ fontSize: '0.65rem', py: 0.25, px: 0.75 }}>{text.unitIn}</ToggleButton>
                      <ToggleButton value="cm" sx={{ fontSize: '0.65rem', py: 0.25, px: 0.75 }}>{text.unitCm}</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </TableCell>
                {sizes.map((size) => (
                  <TableCell key={size.id} align="center" sx={headCellSx}>
                    {size.label.trim() || '—'}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {unitLabel}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell padding="checkbox" />
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{measurementCode(index)}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={row.name}
                      onChange={(event) => patch(row.id, { name: event.target.value })}
                      inputProps={{ 'aria-label': text.measureName }}
                      sx={{ minWidth: 150 }}
                    />
                  </TableCell>
                  {sizes.map((size) => (
                    <TableCell key={size.id} align="center" sx={{ px: 0.5 }}>
                      <TextField
                        size="small"
                        value={row.values[size.id] ?? ''}
                        onChange={(event) => setValue(row, size.id, event.target.value)}
                        inputProps={{ style: { textAlign: 'center' }, 'aria-label': size.label }}
                        sx={{ width: 72 }}
                      />
                    </TableCell>
                  ))}
                  <TableCell padding="checkbox">
                    <Tooltip title={text.remove}>
                      <IconButton
                        aria-label={text.remove}
                        onClick={() => onChange(measurements.filter((candidate) => candidate.id !== row.id))}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        <Button startIcon={<Plus size={16} />} onClick={() => onChange([...measurements, newMeasureRow()])}>
          {text.addMeasure}
        </Button>
      </Box>
    </SectionCard>
  );
}
