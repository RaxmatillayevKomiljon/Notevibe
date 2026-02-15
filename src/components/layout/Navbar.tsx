import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { PenTool, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check auth state on mount
        const auth = localStorage.getItem('demo_auth');
        setIsAuthenticated(!!auth);

        // Listen for storage events to update state across tabs/windows
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('demo_auth'));
        };

        // Custom event for immediate local updates
        window.addEventListener('auth-change', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('auth-change', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('demo_auth');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('auth-change'));
        addToast('Tizimdan muvaffaqiyatli chiqildi', 'info');
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <PenTool className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Notevibe
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Imkoniyatlar</a>
                    <a href="#how" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Qanday ishlaydi?</a>
                    <a href="#awards" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">G'oliblar</a>
                    <a href="#faq" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">FAQ</a>
                </div>

                {/* Auth Button (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="secondary" size="sm">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="w-4 h-4 mr-2" />
                                Chiqish
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button size="sm">Kirish</Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl animate-in-up">
                    <a href="#features" className="text-slate-600 font-medium p-2 block" onClick={() => setIsMenuOpen(false)}>Imkoniyatlar</a>
                    <a href="#how" className="text-slate-600 font-medium p-2 block" onClick={() => setIsMenuOpen(false)}>Qanday ishlaydi?</a>
                    <a href="#awards" className="text-slate-600 font-medium p-2 block" onClick={() => setIsMenuOpen(false)}>G'oliblar</a>
                    <a href="#faq" className="text-slate-600 font-medium p-2 block" onClick={() => setIsMenuOpen(false)}>FAQ</a>
                    <div className="h-px bg-slate-100 my-2" />
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 px-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-sm font-medium text-slate-900">Tizimga kirilgan</span>
                            </div>
                            <Button variant="danger" className="w-full justify-center" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                                Chiqish
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full justify-center">Kirish</Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
