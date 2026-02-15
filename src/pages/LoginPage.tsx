import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { PenTool, ArrowLeft, Lock, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function LoginPage() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Redirect if already logged in
        if (localStorage.getItem('demo_auth')) {
            navigate('/');
        }
        // Focus first input
        usernameRef.current?.focus();
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        const newErrors: { username?: string; password?: string } = {};

        // Validation
        if (!username.trim()) {
            newErrors.username = "Foydalanuvchi nomini kiriting";
        }
        if (!password.trim()) {
            newErrors.password = "Parolni kiriting";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Shake animation trigger could go here
            return;
        }

        // Demo Login Logic
        setIsLoading(true);
        setErrors({});

        setTimeout(() => {
            localStorage.setItem('demo_auth', 'true');
            window.dispatchEvent(new Event('auth-change')); // Update Navbar state immediately
            addToast('Kirish muvaffaqiyatli (Demo rejim)', 'success');
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Back Link */}
            <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Bosh sahifaga qaytish
            </Link>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-in-up border border-slate-100">
                <div className="text-center mb-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-600/30">
                        <PenTool className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Xush kelibsiz!</h1>
                    <p className="text-slate-500">Davom etish uchun hisobingizga kiring.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Login</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                ref={usernameRef}
                                type="text"
                                className={cn(
                                    "w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400",
                                    errors.username && "border-red-300 bg-red-50 focus:border-red-500"
                                )}
                                placeholder="Ismingiz"
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-500 text-xs font-semibold ml-1 animate-in-up">{errors.username}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Parol</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                ref={passwordRef}
                                type="password"
                                className={cn(
                                    "w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400",
                                    errors.password && "border-red-300 bg-red-50 focus:border-red-500"
                                )}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs font-semibold ml-1 animate-in-up">{errors.password}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg h-12 mt-4 shadow-xl shadow-blue-600/20"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Kirish...' : 'Kirish'}
                    </Button>

                    <div className="text-center mt-6">
                        <a href="#" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">Parolni unutdingizmi?</a>
                    </div>
                </form>
            </div>

            <p className="mt-8 text-center text-slate-400 text-sm">
                Hisobingiz yo'qmi? <span className="text-blue-600 font-semibold cursor-pointer">So'rov yuborish</span>
            </p>
        </div>
    );
}
