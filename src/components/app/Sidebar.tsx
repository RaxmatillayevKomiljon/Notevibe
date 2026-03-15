import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, User, LogOut, PenSquare, Settings, Bell, Shield, Sun, Moon, Monitor, Library } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useAuth } from '../auth/AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../lib/i18n';
import { getUnreadCount } from '../../lib/notifications';


const navItemKeys = [
    { icon: Home, labelKey: 'nav.home', path: '/dashboard' },
    { icon: Compass, labelKey: 'nav.explore', path: '/explore' },
    { icon: Bell, labelKey: 'nav.notifications', path: '/notifications' },
    { icon: Bookmark, labelKey: 'nav.bookmarks', path: '/bookmarks' },
    { icon: User, labelKey: 'nav.profile', path: '/profile' },
    { icon: Library, labelKey: 'nav.libraries', path: '/libraries' },
    { icon: Settings, labelKey: 'nav.settings', path: '/settings' },
];

const ADMIN_EMAILS = ['komiljonraxmatillayev5@gmail.com'];

export function Sidebar() {
    const location = useLocation();
    const { user, signOut } = useAuth();
    const { t } = useTranslation();
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [profileData, setProfileData] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

    // Theme state
    type ThemeMode = 'light' | 'dark' | 'system';
    const [theme, setTheme] = useState<ThemeMode>(
        () => (localStorage.getItem('notevibe-theme') as ThemeMode) || 'light'
    );
    const themeIcons: Record<ThemeMode, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };
    const ThemeIcon = themeIcons[theme];

    function cycleTheme() {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const next = modes[(modes.indexOf(theme) + 1) % modes.length];
        setTheme(next);
        localStorage.setItem('notevibe-theme', next);
        const root = document.documentElement;
        if (next === 'system') {
            root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
        } else {
            root.classList.toggle('dark', next === 'dark');
        }
    }

    // Fetch profile from DB for accurate display
    useEffect(() => {
        if (user) {
            supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .maybeSingle()
                .then(({ data }) => {
                    if (data) setProfileData(data);
                });
            // Fetch unread notification count
            getUnreadCount(user.id).then(setUnreadNotifs);
        }
    }, [user]);

    const handleLogout = async () => {
        await signOut();
    };

    // Priority: DB profile > Google metadata > email fallback
    const displayName =
        profileData?.full_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.username ||
        user?.email?.split('@')[0] ||
        'Foydalanuvchi';

    const avatarUrl =
        profileData?.avatar_url ||
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#050505] border-r border-slate-200 dark:border-white/10 hidden md:flex flex-col z-50">
            {/* Logo */}
            <div className="p-6">
                <Link to="/dashboard" className="flex items-center gap-2 mb-8">
                    <div className="bg-blue-600 p-2 rounded-xl">
                        <PenSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Notevibe
                    </span>
                </Link>

                <Link to="/create-post">
                    <Button className="w-full justify-start gap-2 shadow-lg shadow-blue-500/20 mb-6">
                        <PenSquare className="w-4 h-4" />
                        {t('nav.newPost')}
                    </Button>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItemKeys.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                                    : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-zinc-50 dark:hover:text-white"
                            )}>
                                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400 dark:text-slate-500 dark:text-zinc-400")} />
                                <span className="flex-1">{t(item.labelKey)}</span>
                                {item.path === '/notifications' && unreadNotifs > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                                        {unreadNotifs > 9 ? '9+' : unreadNotifs}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}

                {/* Admin Nav (admin only) */}
                {user && ADMIN_EMAILS.includes(user.email || '') && (
                    <Link to="/admin">
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                            location.pathname === '/admin'
                                ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600"
                                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-zinc-50 dark:hover:text-white"
                        )}>
                            <Shield className={cn("w-5 h-5", location.pathname === '/admin' ? "text-violet-600" : "text-slate-400 dark:text-slate-500 dark:text-zinc-400")} />
                            <span>{t('nav.admin')}</span>
                        </div>
                    </Link>
                )}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10">
                <Link to="/profile">
                    <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-slate-50 dark:bg-[#111111] dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <img
                            src={avatarUrl}
                            alt="User"
                            className="w-9 h-9 rounded-full bg-white border border-slate-200 object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-50 truncate">
                                {displayName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={cycleTheme}
                        title={theme}
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ThemeIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                    </button>
                </div>
            </div>
        </aside>
    );
}
