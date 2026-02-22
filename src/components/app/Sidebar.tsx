import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, User, LogOut, PenSquare, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useAuth } from '../auth/AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const navItems = [
    { icon: Home, label: 'Bosh sahifa', path: '/dashboard' },
    { icon: Compass, label: 'Kesht etish', path: '/explore' },
    { icon: Bookmark, label: 'Saqlanganlar', path: '/bookmarks' },
    { icon: User, label: 'Profil', path: '/profile' },
    { icon: Settings, label: 'Sozlamalar', path: '/settings' },
];

export function Sidebar() {
    const location = useLocation();
    const { user, signOut } = useAuth();
    const [profileData, setProfileData] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-50">
            {/* Logo */}
            <div className="p-6">
                <Link to="/dashboard" className="flex items-center gap-2 mb-8">
                    <div className="bg-blue-600 p-2 rounded-xl">
                        <PenSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Notevibe
                    </span>
                </Link>

                <Link to="/create-post">
                    <Button className="w-full justify-start gap-2 shadow-lg shadow-blue-500/20 mb-6">
                        <PenSquare className="w-4 h-4" />
                        Note yozish
                    </Button>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}>
                                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-100">
                <Link to="/profile">
                    <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <img
                            src={avatarUrl}
                            alt="User"
                            className="w-9 h-9 rounded-full bg-white border border-slate-200 object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {displayName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Chiqish
                </button>
            </div>
        </aside>
    );
}
