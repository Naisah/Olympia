import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const News = lazy(() => import('./pages/News'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Business = lazy(() => import('./pages/Business'));
const Documents = lazy(() => import('./pages/Documents'));
const Services = lazy(() => import('./pages/Services'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const FaceRegistration = lazy(() => import('./components/FaceRegistration'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
import AccessibilityWidget from './components/AccessibilityWidget';

const CoveredCourt = lazy(() => import('./pages/services/CoveredCourt'));
const MaternalCare = lazy(() => import('./pages/services/MaternalCare'));
const AnimalCare = lazy(() => import('./pages/services/AnimalCare'));
const MedicalConsult = lazy(() => import('./pages/services/MedicalConsult'));
const Vaccination = lazy(() => import('./pages/services/Vaccination'));
const MentalHealth = lazy(() => import('./pages/services/MentalHealth'));
const PhilHealth = lazy(() => import('./pages/services/PhilHealth'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Suspense fallback={<div role="status" className="p-8 text-center">Loading page…</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="business" element={<Business />} />
          <Route path="documents" element={<Documents />} />
          <Route path="services" element={<Services />} />
          <Route path="services/covered-court" element={<CoveredCourt />} />
          <Route path="services/maternal-child" element={<MaternalCare />} />
          <Route path="services/animal-care" element={<AnimalCare />} />
          <Route path="services/medical-consult" element={<MedicalConsult />} />
          <Route path="services/vaccination" element={<Vaccination />} />
          <Route path="services/mental-health" element={<MentalHealth />} />
          <Route path="services/philhealth" element={<PhilHealth />} />
          <Route path="ekyc" element={<FaceRegistration />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      </Suspense>
      <AccessibilityWidget />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
