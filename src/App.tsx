import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { getTheme } from './theme';
import { themeStore } from './stores/themeStore';
import { Home } from './pages/Home/Home';

export const App = observer(function App() {
  return (
    <ThemeProvider theme={getTheme(themeStore.isDark)}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
});
