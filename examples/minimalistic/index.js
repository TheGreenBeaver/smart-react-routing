import { createRoot } from 'react-dom/client';
import App from './App';
import { AppStateProvider } from './appState';
import { BrowserRouter as Router } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));
root.render(
  <Router>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </Router>
);