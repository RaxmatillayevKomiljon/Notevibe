import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Home, Compass, PenSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function AppLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Sidebar />

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
                <div className="container mx-auto px-4 py-6 max-w-5xl">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Actions (Floating) - Optional addition for mobile UX */}
            <div className="md:hidden fixed bottom-20 right-4 z-50">
                <Link to="/create-post">
                    <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform">
                        <PenSquare className="w-6 h-6" />
                    </button>
                </Link>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 px-6 py-3 flex justify-between items-center">
                <Link to="/dashboard" className={cn("p-2", location.pathname === '/dashboard' ? "text-blue-600" : "text-slate-400")}>
                    <Home className="w-6 h-6" />
                </Link>
                <Link to="/explore" className={cn("p-2", location.pathname === '/explore' ? "text-blue-600" : "text-slate-400")}>
                    <Compass className="w-6 h-6" />
                </Link>
                <Link to="/profile" className={cn("p-2", location.pathname === '/profile' ? "text-blue-600" : "text-slate-400")}>
                    <User className="w-6 h-6" />
                </Link>
            </nav>
        </div>
    );
}
