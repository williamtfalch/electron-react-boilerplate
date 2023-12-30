import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  MemoryRouter as Router,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import './App.css';
import { Logs } from './components/logs/logs';
import { HistoricalLogs } from './components/historicalLogs/historicalLogs';
import { Layout } from './components/layout/layout';
import { Seeding } from './components/seeding/seeding';
import { Scout } from './components/scout/scout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HistoricalLogs />} />
          <Route path="Klick3R" element={<HistoricalLogs />} />
          {
            //<Route path="seeding" element={<Seeding />} />
          }
          <Route path="scout" element={<Scout />} />
        </Route>
      </Routes>
    </Router>
  );
}
