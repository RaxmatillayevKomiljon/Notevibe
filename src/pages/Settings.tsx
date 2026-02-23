import { Button } from '../components/ui/Button';
import { useAuth } from '../components/auth/AuthProvider';
import { User, Bell, Shield, LogOut, ChevronRight, Moon, Sun, Monitor, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

const themeLabels: Record<ThemeMode, string> = {
    light: "Yorug'",
    dark: "Qorong'i",
    system: 'Sistema',
};

const themeIcons: Record<ThemeMode, typeof Sun> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
};

function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
    } else {
        root.classList.toggle('dark', mode === 'dark');
    }
}

export function Settings() {
    const { user, signOut } = useAuth();
    const [theme, setTheme] = useState<ThemeMode>(() => {
        return (localStorage.getItem('notevibe-theme') as ThemeMode) || 'light';
    });

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('notevibe-theme', theme);

        if (theme === 'system') {
            const mql = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme('system');
            mql.addEventListener('change', handler);
            return () => mql.removeEventListener('change', handler);
        }
    }, [theme]);

    function cycleTheme() {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % modes.length;
        setTheme(modes[nextIndex]);
    }

    const handleLogout = async () => {
        await signOut();
    };

    const ThemeIcon = themeIcons[theme];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Sozlamalar</h1>

            <div className="space-y-6">
                {/* Account Section */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Akkaunt
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Profil ma'lumotlari</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Ism, rasm va bio</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
                                O'zgartirish
                            </Button>
                        </div>
                        <div className="border-t border-slate-50 dark:border-slate-700 my-2" />
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Email manzili</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Tasdiqlangan
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Preferences */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-purple-600" />
                            Ilova sozlamalari
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-700">
                        {/* Theme Switcher */}
                        <button
                            onClick={cycleTheme}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <ThemeIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Mavzu</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{themeLabels[theme]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">Bosing</span>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Til</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">O'zbekcha</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Bildirishnomalar</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Yoqilgan</p>
                                </div>
                            </div>
                            <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </button>
                    </div>
                </Card>

                {/* Security */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            Xavfsizlik
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Parolni o'zgartirish</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Oxirgi o'zgarish: 3 oy oldin</p>
                            </div>
                            <Button variant="outline" size="sm">
                                O'zgartirish
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Logout */}
                <div className="pt-4">
                    <Button
                        variant="ghost"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start h-12 gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        Akkauntdan chiqish
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Notevibe v1.0.2 • 2024
                    </p>
                </div>
            </div>
        </div>
    );
}
