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
import VotePage from './pages/Vote/VotePage';
import MyBlueprintsPage from './pages/MyBlueprints/MyBlueprintsPage';
import BlueprintEditorPage from './pages/BlueprintEditor/BlueprintEditorPage';
import './styles/global.css';
import StartPage from './pages/Start/StartPage';
import PreTransPage from './pages/PreTrans/PreTransPage';
import StartSelection from './pages/Start/StartSelection';
import ArenaPage from './pages/Arena/ArenaPage';
import PlanPage from './pages/Arena/PlanPage';
import VerifyPage from './pages/Verify/VerifyPage';
import TransitionalPage from './pages/Transitional/TransitionalPage';
import DestinationPage from './pages/Destination/DestinationPage';

function App() {
    return (
        <LangProvider>
            <EntryGate>
                <Routes>
                    {/* Standalone pages without the main layout */}
                    <Route path="/" element={<StartPage />} />
                    <Route path="/pre" element={<PreTransPage />} />
                    <Route path="/choose" element={<StartSelection />} />

                    {/* Main application routes with Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route path="blueprint/gov/:blueprintId" element={<BlueprintViewer />} />
                        <Route path="blueprint/gov/:blueprintId/sectors" element={<SectorsIndex />} />
                        <Route path="blueprint/gov/:blueprintId/sectors/:sectorId" element={<SectorPage />} />
                        <Route path="blueprint/gov/:blueprintId/layers" element={<LayersPage />} />
                        <Route path="blueprint/gov/:blueprintId/roadmap" element={<RoadmapPage />} />
                        
                        {/* Global pages that use the main layout */}
                        <Route path="compare" element={<ComparePage />} />
                        <Route path="vote" element={<VotePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="arena" element={<ArenaPage />} />
                        <Route path="arena/:slug" element={<PlanPage />} />
                        <Route path="verify" element={<VerifyPage />} />
                        
                        {/* Functional pages */}
                        <Route path="my-blueprints" element={<MyBlueprintsPage />} />
                        <Route path="blueprint-editor/:blueprintId" element={<BlueprintEditorPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="admin" element={<AdminPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="privacy" element={<PrivacyPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="login" element={<LoginPage />} />

                        {/* Post-collapse: The Destination */}
                        <Route path="destination" element={<DestinationPage />} />
                    </Route>

                    {/* Redirects for convenience and legacy paths */}
                    <Route path="/blueprint" element={<Navigate to="/blueprint/gov/decentralized" replace />} />
                    <Route path="/sectors" element={<Navigate to="/blueprint/gov/decentralized/sectors" replace />} />
                    <Route path="/layers" element={<Navigate to="/blueprint/gov/decentralized/layers" replace />} />
                    <Route path="/roadmap" element={<Navigate to="/blueprint/gov/decentralized/roadmap" replace />} />

                    {/* Global fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </EntryGate>
        </LangProvider>
    );
}

export default App;
