import { useNavigate } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import { Construction } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import { useI18n } from '../contexts/I18nContext';
import { getOrdersText } from '../utils/ordersText';

interface PlaceholderPageProps {
  title: string;
  titleAr?: string;
}

/** Stand-in for modules that are built later (Cutting, Sorting, Sewing, QC, Inventory…). */
export default function PlaceholderPage({ title: titleEn, titleAr }: PlaceholderPageProps) {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const text = getOrdersText(locale);
  const title = locale === 'ar' && titleAr ? titleAr : titleEn;
  return (
    <>
      <PageHeader title={title} />
      <Paper>
        <EmptyState
          icon={Construction}
          title={text.notBuilt(title)}
          message={text.notBuiltMessage}
          action={
            <Button variant="outlined" onClick={() => navigate('/production/orders')}>
              {text.goToOrders}
            </Button>
          }
        />
      </Paper>
    </>
  );
}
