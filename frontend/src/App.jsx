import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import AuditFormPage from './pages/AuditFormPage';
import ResultsPage from './pages/ResultsPage';
import SharedPage from './pages/SharedPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/"              element={<LandingPage />} />
            <Route path="/audit"         element={<AuditFormPage />} />
            <Route path="/results/:shareId" element={<ResultsPage />} />
            <Route path="/share/:shareId"   element={<SharedPage />} />
            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                  <p className="text-6xl mb-4">🤷</p>
                  <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
                  <a href="/" className="btn-primary mt-4 inline-flex">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
