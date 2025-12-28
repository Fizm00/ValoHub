import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Maps from './pages/Maps';
import Weapons from './pages/Weapons';
import SquadBuilder from './pages/SquadBuilder';
import CrosshairGallery from './pages/CrosshairGallery';
import CrosshairGenerator from './pages/CrosshairGenerator';
import AddProCrosshair from './pages/AddProCrosshair';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/weapons" element={<Weapons />} />
          <Route path="/squad-builder" element={<SquadBuilder />} />
          <Route path="/crosshairs" element={<CrosshairGallery />} />
          <Route path="/crosshairs/add" element={<AddProCrosshair />} />
          <Route path="/crosshair/create" element={<CrosshairGenerator />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
