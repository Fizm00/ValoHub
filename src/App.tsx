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
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Skins from './pages/Skins';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/weapons" element={<Weapons />} />
              <Route path="/squad-builder" element={<SquadBuilder />} />
              <Route path="/skins" element={<Skins />} />
              <Route path="/crosshairs" element={<CrosshairGallery />} />
              <Route path="/crosshairs/add" element={<AddProCrosshair />} />
              <Route path="/crosshair/create" element={<CrosshairGenerator />} />
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
