import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { AppRoutes } from './routes/AppRoutes';
import { createAppTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider, useI18n } from './contexts/I18nContext';

/**
 * MUI writes physical CSS (margin-left, text-align: left, left: 0 ...). The RTL plugin mirrors all of it
 * when the language is Arabic, so write styles as for English and they flip on their own:
 * text alignment, table cells, input labels, and the spacing between a button icon (like +) and its text.
 */
const cacheLtr = createCache({ key: 'muiltr' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });

function ThemedApp() {
  const { dir } = useI18n();
  const theme = useMemo(() => createAppTheme(dir), [dir]);

  return (
    <CacheProvider value={dir === 'rtl' ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </I18nProvider>
  );
}
