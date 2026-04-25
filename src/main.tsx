import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app.tsx';
import './index.css';

import { ThemeProvider } from 'next-themes';

render(
  <ThemeProvider attribute="class">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('app')!,
);
