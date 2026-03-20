import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LangProvider } from './contexts/LangContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import TermsPage from './pages/Terms/TermsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoginPage from './pages/Login/LoginPage';
import ComparePage from './pages/Compare/ComparePage';
import TransitionalComparePage from './pages/Compare/TransitionalComparePage';
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
import MousaviPage from './pages/Mousavi/MousaviPage';
import CivilSocietyPage from './pages/CivilSociety/CivilSocietyPage';
import ITCPage from './pages/ITC/ITCPage';
import TransitionalPlansPage from './pages/Plans/TransitionalPlansPage';
import BlueprintsListPage from './pages/Blueprints/BlueprintsListPage';
import URIPage from './pages/URI/URIPage';
import CPFIKPage from './pages/CPFIK/CPFIKPage';
import JMIPage from './pages/JMI/JMIPage';
import JMIPage2 from './pages/JMI-v2/JMIPage';
import AdminDraftGuard from './components/AdminDraftGuard/AdminDraftGuard';
import ArenaSubmitPage from './pages/Arena/ArenaSubmitPage';
import CPILDPage from './pages/CPILD/CPILDPage';
import GlobalPage from './pages/Global/GlobalPage';
import ComingSoonPage from './pages/ComingSoon/ComingSoonPage';
import AccessModePage from './pages/AccessMode/AccessModePage';
import CareersPage from './pages/Careers/CareersPage';
import ApplyPage from './pages/Careers/ApplyPage';

function App() {
    return (
        <ThemeProvider>
        <LangProvider>
            <EntryGate>
                <Routes>
                    {/* Standalone pages without the main layout */}
                    <Route path="/" element={<StartPage />} />
                    <Route path="/access-mode" element={<AccessModePage />} />
                    <Route path="/pre" element={<PreTransPage />} />
                    <Route path="/choose" element={<StartSelection />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Main application routes with Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route path="blueprint/gov/:blueprintId" element={<BlueprintViewer />} />
                        <Route path="blueprint/gov/:blueprintId/sectors" element={<SectorsIndex />} />
                        <Route path="blueprint/gov/:blueprintId/sectors/:sectorId" element={<SectorPage />} />
                        <Route path="blueprint/gov/:blueprintId/layers" element={<LayersPage />} />
                        <Route path="blueprint/gov/:blueprintId/roadmap" element={<RoadmapPage />} />
                        
                        {/* Global pages that use the main layout */}
                        <Route path="compare" element={<ComparePage />} />
                        <Route path="compare/transition" element={<TransitionalComparePage />} />
                        <Route path="vote" element={<VotePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="arena" element={<ArenaPage />} />
                        <Route path="arena/:slug" element={<PlanPage />} />
                        <Route path="arena/submit" element={<ArenaSubmitPage />} />
                        <Route path="transitional/plan/nufdi" element={<TransitionalPage />} />
                        <Route path="transitional/plan/mirhosein-mousavi" element={<MousaviPage />} />
                        <Route path="transitional/plan/itc" element={<ITCPage />} />
                        <Route path="transitional/plan/uri" element={<URIPage />} />
                        <Route path="transitional/plan/cpfik" element={<CPFIKPage />} />
                        <Route path="transitional/plan/jmi" element={<JMIPage />} />
                        <Route path="transitional/plan/jmi-v2" element={<AdminDraftGuard slug="transitional/plan/jmi-v2"><JMIPage2 /></AdminDraftGuard>} />
                        <Route path="transitional/plan/civil-society" element={<CivilSocietyPage />} />
                        <Route path="transitional/plan/cpild" element={<CPILDPage />} />
                        <Route path="plans" element={<TransitionalPlansPage />} />
                        <Route path="blueprints" element={<BlueprintsListPage />} />
                        <Route path="verify" element={<VerifyPage />} />
                        
                        {/* Functional pages */}
                        <Route path="my-blueprints" element={<MyBlueprintsPage />} />
                        <Route path="blueprint-editor/:blueprintId" element={<BlueprintEditorPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="admin" element={<AdminPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="privacy" element={<PrivacyPage />} />
                        <Route path="terms" element={<TermsPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="careers" element={<CareersPage />} />
                        <Route path="apply" element={<ApplyPage />} />


                        {/* Post-collapse: The Destination */}
                        <Route path="destination" element={<DestinationPage />} />
                        <Route path="global" element={<AdminDraftGuard slug="global"><GlobalPage /></AdminDraftGuard>} />

                        {/* Coming soon — planned features */}
                        <Route path="transition/main-stage" element={<ComingSoonPage />} />
                        <Route path="transition/incubator" element={<ComingSoonPage />} />
                        <Route path="transition/amendment-floor" element={<ComingSoonPage />} />
                        <Route path="transition/shadow-cabinet" element={<ComingSoonPage />} />
                    </Route>

                    {/* Redirects for convenience and legacy paths */}
                    <Route path="/transitional" element={<Navigate to="/plans" replace />} />
                    <Route path="/blueprint" element={<Navigate to="/blueprint/gov/decentralized" replace />} />
                    <Route path="/sectors" element={<Navigate to="/blueprint/gov/decentralized/sectors" replace />} />
                    <Route path="/layers" element={<Navigate to="/blueprint/gov/decentralized/layers" replace />} />
                    <Route path="/roadmap" element={<Navigate to="/blueprint/gov/decentralized/roadmap" replace />} />

                    {/* Global fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </EntryGate>
        </LangProvider>
        </ThemeProvider>
    );
}

export default App;
