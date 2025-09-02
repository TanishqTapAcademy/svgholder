import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SvgViewer from './pages/SvgViewer';
import SvgImporter from './pages/SvgImporter';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/svg-viewer" element={<div className="pt-20 min-h-screen bg-gray-50"><SvgViewer /></div>} />
            <Route path="/svg-importer" element={<div className="pt-20 min-h-screen bg-gray-50"><SvgImporter /></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
