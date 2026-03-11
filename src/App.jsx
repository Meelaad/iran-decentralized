import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LangProvider } from './contexts/LangContext';
import Layout from './components/Layout/Layout';
import EntryGate from './components/EntryGate/EntryGate';
import BlueprintViewer from './BlueprintViewer';
import SectorsIndex from './pages/Sector/SectorsIndex';
import SectorPage from './pages/Sector/SectorPage';
import LayersPage from './pages/Layers/LayersPage';
import RoadmapPage from './pages/Roadmap/RoadmapPage';
import AboutPage from './pages/About/AboutPage';
import RegisterPage from './pages/Register/RegisterPage';
import AdminPage from './pages/Admin/AdminPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import ContactPage from './pages/Contact/ContactPage';
import PrivacyPage from './pages/Privacy/PrivacyPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoginPage from './pages/Login/LoginPage';
import ComparePage from './pages/Compare/ComparePage';
import './styles/global.css';

function App() {
    return (
        <LangProvider>
            <EntryGate>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Navigate to="/blueprint/decentralized" replace />} />
                        <Route path="blueprint/:blueprintId" element={<BlueprintViewer />} />
                        <Route path="blueprint/:blueprintId/sectors" element={<SectorsIndex />} />
                        <Route path="blueprint/:blueprintId/sectors/:sectorId" element={<SectorPage />} />
                        <Route path="sectors" element={<Navigate to="/blueprint/decentralized/sectors" replace />} />
                        <Route path="sectors/:sectorId" element={<SectorPage />} />
                        <Route path="layers" element={<LayersPage />} />
                        <Route path="roadmap" element={<RoadmapPage />} />
                        <Route path="compare" element={<ComparePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="admin" element={<AdminPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="privacy" element={<PrivacyPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </EntryGate>
        </LangProvider>
    );
}

export default App;