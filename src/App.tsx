import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from './lib/apiService';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { OffersSection as Offers } from './components/sections/OffersSection';
import { VisaSection } from './components/sections/VisaSection';
import { CheckCircle, AlertCircle } from 'lucide-react';

const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const OffersPage = lazy(() => import('./pages/OffersPage').then(m => ({ default: m.OffersPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FlightsPage = lazy(() => import('./pages/FlightsPage').then(m => ({ default: m.FlightsPage })));
const HotelsPage = lazy(() => import('./pages/HotelsPage').then(m => ({ default: m.HotelsPage })));
const VisaPage = lazy(() => import('./pages/VisaPage').then(m => ({ default: m.VisaPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage').then(m => ({ default: m.DestinationsPage })));
const OfferDetailsPage = lazy(() => import('./pages/OfferDetailsPage').then(m => ({ default: m.OfferDetailsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [appToast, setAppToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showAppToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') return; // Silence errors as per user request
    setAppToast({ message, type });
    setTimeout(() => setAppToast(null), 3000);
  };
 const [currentPage, setCurrentPage] = useState('home');
 const [bookingService, setBookingService] = useState('flight');
 const [bookingContext, setBookingContext] = useState<any>(null);

  // Unified Global Site State
  const [siteData, setSiteData] = useState({
    offers: [] as any[],
    destinations: [] as any[],
    bookings: [] as any[],
    visas: [] as any[],
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/share/1C6WokSrAE/' },
      { platform: 'whatsapp', url: 'https://wa.me/201154162244' }
    ] as any[],
    contactInfo: {
      phones: ['+201154162244', '+201103103362', '+201553004593'],
      email: 'reservation@sabreentourism.com',
      address: 'روكسي - الدور السادس - مصر الجديده - القاهرة',
      addressUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3452.0395265189827!2d31.3157442!3d30.0930543!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f2677e86c29%3A0x9db43d23d014bfc5!2ssteps%20co%20working%20space%20Heliopolis!5e0!3m2!1sar!2seg!4v1776437866510!5m2!1sar!2seg',
    } as any
  });

  // Fetch all data from MySQL
  const fetchData = async () => {
    try {
      const user = await apiService.getCurrentUser().catch(() => null);
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      }

      // Handle URL-based login trigger
      if (window.location.pathname === '/admin-login') {
        setIsLoginOpen(true);
        // Optional: Clean up URL after showing modal to avoid re-trigger on refresh if desired
        // window.history.replaceState({}, '', '/');
      }

      const [
        offers,
        destinations,
        visas,
        socialLinks,
        contactInfo
      ] = await Promise.all([
        apiService.getOffers().catch(() => []),
        apiService.getDestinations().catch(() => []),
        apiService.getVisas().catch(() => []),
        apiService.getSocialLinks().catch(() => []),
        apiService.getContactInfo().catch(() => null)
      ]);

      const bookings = user ? await apiService.getBookings().catch(() => []) : [];

      setSiteData(prev => ({
        ...prev,
        offers: offers || [],
        destinations: destinations || [],
        bookings: bookings || [],
        visas: visas || [],
        socialLinks: socialLinks?.length ? socialLinks : prev.socialLinks,
        contactInfo: contactInfo || prev.contactInfo
      }));
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  useEffect(() => {
    if (window.location.pathname === '/admin-login') {
      setIsLoginOpen(true);
      window.history.replaceState(null, '', '/');
    }
    fetchData();
  }, []);

  const handleNavigate = (page: string, service?: string, context?: any) => {
    if (page === 'login') {
      setIsLoginOpen(true);
      return;
    }
    if (['home', 'offers', 'destinations', 'dashboard'].includes(page)) {
      fetchData();
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (service) {
      setBookingService(service);
    }
    if (context) {
      setBookingContext(context);
    } else {
      setBookingContext(null);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    try {
      const user = await apiService.getCurrentUser();
      setCurrentUser(user);
      // Fetch authenticated data (like bookings) after login
      await fetchData();
    } catch (error) {
      console.error('Error fetching user after login:', error);
    }
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await apiService.signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setSiteData(prev => ({ ...prev, bookings: [] }));
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggedIn(false);
      setCurrentUser(null);
      setSiteData(prev => ({ ...prev, bookings: [] }));
      setCurrentPage('home');
    }
  };

  if (currentPage === 'dashboard') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div></div>}>
          <DashboardPage 
            onLogout={handleLogout} 
            onNavigate={handleNavigate}
            offers={siteData.offers}
            setOffers={(val: any) => setSiteData(p => ({ ...p, offers: typeof val === 'function' ? val(p.offers) : val }))}
            destinations={siteData.destinations}
            setDestinations={(val: any) => setSiteData(p => ({ ...p, destinations: typeof val === 'function' ? val(p.destinations) : val }))}
            bookings={siteData.bookings}
            setBookings={(val: any) => setSiteData(p => ({ ...p, bookings: typeof val === 'function' ? val(p.bookings) : val }))}
            visas={siteData.visas}
            setVisas={(val: any) => setSiteData(p => ({ ...p, visas: typeof val === 'function' ? val(p.visas) : val }))}
            socialLinks={siteData.socialLinks}
            setSocialLinks={(val: any) => setSiteData(p => ({ ...p, socialLinks: typeof val === 'function' ? val(p.socialLinks) : val }))}
            contactInfo={siteData.contactInfo}
            setContactInfo={(val: any) => setSiteData(p => ({ ...p, contactInfo: typeof val === 'function' ? val(p.contactInfo) : val }))}
            onRefresh={fetchData}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-[100dvh] bg-surface font-sans text-muted-dark selection:bg-primary-soft selection:text-primary-dark" dir="rtl">
        <Header onNavigate={handleNavigate} currentPage={currentPage} isLoggedIn={isLoggedIn} socialLinks={siteData.socialLinks} />
        <main className="pt-[4.5rem] md:pt-[5rem] bg-surface relative min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Suspense fallback={<PageLoader />}>
                {currentPage === 'home' && (
                  <>
                    <Hero onNavigate={handleNavigate} />
                    <Offers onNavigate={handleNavigate} offers={siteData.offers} onViewDetails={(offer) => { setSelectedOffer(offer); handleNavigate('offer-details'); }} />
                    <VisaSection onNavigate={handleNavigate} visas={siteData.visas} />
                    <Features />
                  </>
                )}
                {currentPage === 'booking' && (
                  <BookingPage 
                    initialServiceType={bookingService} 
                    context={bookingContext} 
                    contactInfo={siteData.contactInfo}
                    socialLinks={siteData.socialLinks}
                    showAppToast={showAppToast}
                    onNavigate={handleNavigate}
                    onAddBooking={(booking: any) => setSiteData(prev => ({ ...prev, bookings: [booking, ...prev.bookings] }))}
                    currentUser={currentUser}
                  />
                )}
                {currentPage === 'flights' && <FlightsPage onNavigate={handleNavigate} />}
                {currentPage === 'hotels' && <HotelsPage onNavigate={handleNavigate} />}
                {currentPage === 'destinations' && <DestinationsPage onNavigate={handleNavigate} destinations={siteData.destinations} />}
                {currentPage === 'offers' && <OffersPage onNavigate={handleNavigate} offers={siteData.offers} onViewDetails={(offer) => { setSelectedOffer(offer); handleNavigate('offer-details'); }} />}
                {currentPage === 'offer-details' && selectedOffer && <OfferDetailsPage offer={selectedOffer} onNavigate={handleNavigate} />}
                {currentPage === 'visa' && <VisaPage onNavigate={handleNavigate} visas={siteData.visas} />}
                {currentPage === 'about' && <AboutPage />}
                {currentPage === 'contact' && <ContactPage contactInfo={siteData.contactInfo} socialLinks={siteData.socialLinks} />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer onNavigate={handleNavigate} socialLinks={siteData.socialLinks} contactInfo={siteData.contactInfo} />

        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
        <AnimatePresence>
          {appToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className={`fixed bottom-8 left-1/2 z-[200] px-4 md:px-6 py-3 md:py-4 rounded-xl border flex items-center justify-center text-center gap-2 md:gap-3 w-[90%] md:w-auto min-w-[300px] max-w-md ${
 appToast.type === 'success' 
 ? 'bg-success-soft text-success border-success-soft-border' 
 : 'bg-danger-soft text-danger border-danger-soft-border'
 }`}
              dir="rtl"
            >
              {appToast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{appToast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
