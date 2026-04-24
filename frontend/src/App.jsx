import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BayviewGuide from './pages/BayviewGuide';
import ClientGuide from './pages/ClientGuide';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bayview-question-guide" element={<BayviewGuide />} />
      <Route path="/client-question-guide" element={<ClientGuide />} />
    </Routes>
  );
}

export default App;
