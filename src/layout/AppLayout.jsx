import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import MobileBottomNav from './MobileBottomNav';

export default function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  // Case 1: Public Landing Page
  if (path === '/') {
    return (
      <div className="min-h-screen flex flex-col bg-page text-charcoal">
        <Header />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  // Case 2: Public Auth Placeholders (/login, /signup)
  if (path === '/login' || path === '/signup') {
    return (
      <div className="min-h-screen flex flex-col bg-page text-charcoal">
        <Header />
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-12 flex items-center justify-center">
          <Outlet />
        </main>
        <footer className="bg-surface border-t border-border-line text-muted text-xs py-4 text-center">
          <p>© 2026 CareMate — Academic Front-End Prototype</p>
        </footer>
      </div>
    );
  }

  // Case 3: Internal Application Shell (/dashboard, /medications, /schedule, /settings, 404)
  return (
    <div className="min-h-screen flex bg-page text-charcoal">
      {/* Desktop / Laptop Persistent Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Internal Top Header with title and language switch */}
        <AppHeader />

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
          <Outlet />
        </main>

        {/* Mobile / Tablet Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
