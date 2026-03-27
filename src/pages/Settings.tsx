import { Button } from '../components/ui/Button';
import { useAuth } from '../components/auth/AuthProvider';
import { User, Bell, Shield, LogOut, ChevronRight, Moon, Sun, Monitor, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { useTranslation, Language } from '../lib/i18n';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../lib/pushNotifications';

type ThemeMode = 'light' | 'dark' | 'system';

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
    const { addToast } = useToast();
    const { t, language, setLanguage } = useTranslation();
    const [theme, setTheme] = useState<ThemeMode>(() => {
        return (localStorage.getItem('notevibe-theme') as ThemeMode) || 'light';
    });
    const [showLangMenu, setShowLangMenu] = useState(false);

    // Password change state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [notifPermission, setNotifPermission] = useState(getNotificationPermissionStatus());

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

    const themeKey: Record<ThemeMode, string> = {
        light: 'settings.themeLight',
        dark: 'settings.themeDark',
        system: 'settings.themeSystem',
    };

    function cycleTheme() {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % modes.length;
        setTheme(modes[nextIndex]);
    }

    function selectLanguage(lang: Language) {
        setLanguage(lang);
        setShowLangMenu(false);
        addToast(`${t('settings.langChanged')}: ${t('settings.lang' + lang.charAt(0).toUpperCase() + lang.slice(1))}`, 'success');
    }

    async function handleChangePassword() {
        if (newPassword.length < 6) {
            addToast(t('settings.passwordMinLength'), 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            addToast(t('settings.passwordMismatch'), 'error');
            return;
        }
        setChangingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            addToast(t('settings.passwordChanged'), 'success');
            setShowPasswordModal(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            addToast(error.message || t('settings.passwordError'), 'error');
        } finally {
            setChangingPassword(false);
        }
    }

    const handleLogout = async () => {
        await signOut();
    };

    const ThemeIcon = themeIcons[theme];
    const langKeys: Language[] = ['uz', 'ru', 'en'];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 mb-6">{t('settings.title')}</h1>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#111111] dark:border-white/5 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10">
                            <h3 className="font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-600" />
                                {t('settings.changePassword')}
                            </h3>
                            <button
                                onClick={() => { setShowPasswordModal(false); setNewPassword(''); setConfirmPassword(''); }}
                                className="text-slate-400 hover:text-slate-600 dark:text-zinc-300 dark:hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{t('settings.newPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showNewPass ? 'text' : 'password'}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#222222] border-2 border-slate-100 dark:border-white/15 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-zinc-50 font-medium placeholder:text-slate-400"
                                        placeholder={t('settings.newPasswordPlaceholder')}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-300"
                                    >
                                        {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{t('settings.confirmPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPass ? 'text' : 'password'}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#222222] border-2 border-slate-100 dark:border-white/15 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-zinc-50 font-medium placeholder:text-slate-400"
                                        placeholder={t('settings.confirmPasswordPlaceholder')}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-300"
                                    >
                                        {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-sm text-red-500">{t('settings.passwordMismatch')}</p>
                            )}
                            <Button
                                className="w-full h-12 mt-2"
                                onClick={handleChangePassword}
                                disabled={changingPassword || !newPassword || !confirmPassword}
                                isLoading={changingPassword}
                            >
                                {t('settings.changePassword')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Account Section */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#111111] dark:border-white/5/50">
                        <h2 className="font-semibold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            {t('settings.account')}
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-zinc-50">{t('settings.profileInfo')}</p>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">{t('settings.profileInfoDesc')}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
                                {t('settings.edit')}
                            </Button>
                        </div>
                        <div className="border-t border-slate-50 dark:border-white/10 my-2" />
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-zinc-50">{t('settings.email')}</p>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">{user?.email}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                {t('settings.verified')}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Preferences */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#111111] dark:border-white/5/50">
                        <h2 className="font-semibold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-purple-600" />
                            {t('settings.appSettings')}
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-700">
                        {/* Theme Switcher */}
                        <button
                            onClick={cycleTheme}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-[#222222] rounded-lg">
                                    <ThemeIcon className="w-5 h-5 text-slate-600 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-zinc-50">{t('settings.theme')}</p>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400">{t(themeKey[theme])}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{t('settings.press')}</span>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-[#222222] rounded-lg">
                                        <Globe className="w-5 h-5 text-slate-600 dark:text-zinc-300" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-zinc-50">{t('settings.language')}</p>
                                        <p className="text-sm text-slate-500 dark:text-zinc-400">{t('settings.lang' + language.charAt(0).toUpperCase() + language.slice(1))}</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showLangMenu ? 'rotate-90' : ''}`} />
                            </button>
                            {showLangMenu && (
                                <div className="px-4 pb-4 space-y-1">
                                    {langKeys.map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => selectLanguage(lang)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${language === lang
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-300'
                                                }`}
                                        >
                                            {t('settings.lang' + lang.charAt(0).toUpperCase() + lang.slice(1))} {language === lang && '✓'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={async () => {
                                if (notifPermission === 'granted') {
                                    addToast('Bildirishnomalarni brauzer sozlamalaridan o\'chirish mumkin', 'info');
                                } else {
                                    const granted = await requestNotificationPermission();
                                    setNotifPermission(granted ? 'granted' : 'denied');
                                    if (granted) {
                                        addToast('Bildirishnomalar yoqildi! 🔔', 'success');
                                    } else {
                                        addToast('Bildirishnomalar rad etildi', 'error');
                                    }
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-[#222222] rounded-lg">
                                    <Bell className="w-5 h-5 text-slate-600 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-zinc-50">{t('settings.notifications')}</p>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                                        {notifPermission === 'granted' ? 'Push bildirishnomalar yoqilgan ✅' :
                                         notifPermission === 'denied' ? 'Bildirishnomalar rad etilgan ❌' :
                                         notifPermission === 'unsupported' ? 'Brauzer qo\'llab-quvvatlamaydi' :
                                         'Bosib yoqing'}
                                    </p>
                                </div>
                            </div>
                            <div className={`w-10 h-6 ${notifPermission === 'granted' ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'} rounded-full relative transition-colors`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifPermission === 'granted' ? 'right-1' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>
                </Card>

                {/* Security */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#111111] dark:border-white/5/50">
                        <h2 className="font-semibold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            {t('settings.security')}
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-zinc-50">{t('settings.changePassword')}</p>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">{t('settings.changePasswordDesc')}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                                {t('settings.edit')}
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
                        {t('settings.logout')}
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Notevibe v1.0.3 • 2024
                    </p>
                </div>
            </div>
        </div>
    );
}
