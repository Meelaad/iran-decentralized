import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DecentralizedGovArchitecture from './DecentralizedGovArchitecture';
import SectorsIndex from './pages/Sector/SectorsIndex';
import SectorPage from './pages/Sector/SectorPage';
import LayersPage from './pages/Layers/LayersPage';
import RoadmapPage from './pages/Roadmap/RoadmapPage';
import AboutPage from './pages/About/AboutPage';
import RegisterPage from './pages/Register/RegisterPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import ContactPage from './pages/Contact/ContactPage';
import './styles/global.css';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<DecentralizedGovArchitecture />} />
                <Route path="sectors" element={<SectorsIndex />} />
                <Route path="sectors/:sectorId" element={<SectorPage />} />
                <Route path="layers" element={<LayersPage />} />
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;