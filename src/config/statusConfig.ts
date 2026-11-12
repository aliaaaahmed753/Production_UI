import type { Locale } from '../contexts/I18nContext';
import type { ProductionStatus } from '../types/production';

export interface StatusConfigEntry {
  label: string;
  labelAr: string;
  /** Text / accent color */
  color: string;
  /** Soft tinted background for badges */
  background: string;
  /** Default progress when an order enters this status */
  progress: number;
  description: string;
  descriptionAr: string;
}

/** Single source of truth for every status color / label in the app. */
export const statusConfig: Record<ProductionStatus, StatusConfigEntry> = {
  PENDING: {
    label: 'Pending',
    labelAr: 'قيد الانتظار',
    color: '#8A6410',
    background: '#F7F0DC',
    progress: 0,
    description: 'Order received, waiting for fabric and cutting to start.',
    descriptionAr: 'تم استلام الأمر وبانتظار الخامة وبدء القص.',
  },
  CUTTING: {
    label: 'Cutting',
    labelAr: 'القص',
    color: '#1F55C9',
    background: '#E5ECFB',
    progress: 25,
    description: 'Fabric is being laid and cut into pieces.',
    descriptionAr: 'يتم فرد الخامة وقصها إلى قطع.',
  },
  SORTING: {
    label: 'Sorting',
    labelAr: 'الفرز',
    color: '#6D3FC0',
    background: '#EDE7FA',
    progress: 40,
    description: 'Cut pieces are being bundled and sorted by size and color.',
    descriptionAr: 'يتم تجميع القطع المقصوصة وفرزها حسب المقاس واللون.',
  },
  SEWING: {
    label: 'Sewing',
    labelAr: 'الخياطة',
    color: '#B45309',
    background: '#FCEBD6',
    progress: 60,
    description: 'Pieces are on the sewing lines.',
    descriptionAr: 'القطع على خطوط الخياطة.',
  },
  QUALITY_CHECK: {
    label: 'Quality Check',
    labelAr: 'فحص الجودة',
    color: '#B93815',
    background: '#FCE5DD',
    progress: 80,
    description: 'Line 1 output is going through random quality checks.',
    descriptionAr: 'إنتاج الخط الأول يمر بفحص جودة عشوائي.',
  },
  INVENTORY: {
    label: 'Inventory',
    labelAr: 'المخزن',
    color: '#0F766E',
    background: '#DAF2EF',
    progress: 90,
    description: 'Line 2 output has been moved to inventory.',
    descriptionAr: 'تم نقل إنتاج الخط الثاني إلى المخزن.',
  },
  COMPLETED: {
    label: 'Completed',
    labelAr: 'مكتمل',
    color: '#157A3C',
    background: '#DCF3E3',
    progress: 100,
    description: 'Order is finished.',
    descriptionAr: 'تم الانتهاء من الأمر.',
  },
};

export const STATUS_ORDER: readonly ProductionStatus[] = [
  'PENDING',
  'CUTTING',
  'SORTING',
  'SEWING',
  'QUALITY_CHECK',
  'INVENTORY',
  'COMPLETED',
];

export const statusOptions = STATUS_ORDER.map((value) => ({
  value,
  label: statusConfig[value].label,
}));

export function statusLabel(status: ProductionStatus, locale: Locale): string {
  return locale === 'ar' ? statusConfig[status].labelAr : statusConfig[status].label;
}

export function statusDescription(status: ProductionStatus, locale: Locale): string {
  return locale === 'ar' ? statusConfig[status].descriptionAr : statusConfig[status].description;
}

export function getStatusOptions(locale: Locale) {
  return STATUS_ORDER.map((value) => ({ value, label: statusLabel(value, locale) }));
}
