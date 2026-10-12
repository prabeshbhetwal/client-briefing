import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
const BayviewGuide = lazy(() => import('./pages/BayviewGuide'));
const ClientGuide = lazy(() => import('./pages/ClientGuide'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Suspense fallback={<p role="status">Loading guide…</p>}><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bayview-question-guide" element={<BayviewGuide />} />
      <Route path="/client-question-guide" element={<ClientGuide />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<main className="admin-page"><h1>Page not found</h1><a href="/">Open briefing form</a></main>} />
    </Routes></Suspense>
  );
}

export default App;
