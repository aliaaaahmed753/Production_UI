import { Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { getOrdersText } from '../../utils/ordersText';
import { EmptyState } from './EmptyState';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const { locale } = useI18n();
  const text = getOrdersText(locale);
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title ?? text.somethingWrong}
      message={message}
      action={
        onRetry && (
          <Button variant="outlined" onClick={onRetry}>
            {text.tryAgain}
          </Button>
        )
      }
    />
  );
}
