import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../lib/supabase';
import { PenTool, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';

export function LoginPage() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user } = useAuth();

    const [isLogin, setIsLogin] = useState(false); // Default to Sign Up
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Redirect if already logged in
    if (user) {
        navigate('/dashboard');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                // LOGIN
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                addToast('Xush kelibsiz!', 'success');
                // Navigate handled by AuthProvider state change
            } else {
                // SIGN UP
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: email.split('@')[0], // Default username
                        }
                    }
                });
                if (error) throw error;
                addToast('Ro\'yxatdan o\'tish muvaffaqiyatli! Iltimos emailni tasdiqlang.', 'success');
            }
        } catch (error: any) {
            addToast(error.message || 'Xatolik yuz berdi', 'error');
        } finally {
            setIsLoading(false);
        }
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
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {isLogin ? 'Xush kelibsiz!' : 'Ro\'yxatdan o\'tish'}
                    </h1>
                    <p className="text-slate-500">
                        {isLogin ? 'Davom etish uchun hisobingizga kiring.' : 'Yangi hisob yarating va jamiyatga qo\'shiling.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Parol</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg h-12 mt-4 shadow-xl shadow-blue-600/20"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
                    </Button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            {isLogin
                                ? "Hisobingiz yo'qmi? Ro'yxatdan o'tish"
                                : "Hisobingiz bormi? Kirish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
