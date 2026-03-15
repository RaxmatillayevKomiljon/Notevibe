import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Users, FileText, Flag, Trash2, CheckCircle, Eye, AlertTriangle, MapPin, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { getAllReports, updateReportStatus } from '../lib/reports';
import type { Report } from '../lib/reports';

type Tab = 'users' | 'posts' | 'reports' | 'admins';

interface AdminUser {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
}

interface AdminPost {
    id: string;
    title: string;
    author_id: string;
    created_at: string;
    likes_count: number;
    author?: { username: string; full_name: string | null };
}

export function AdminPage() {
    const { isAdmin } = useAuth();
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('users');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [admins, setAdmins] = useState<{ user_id: string, created_at: string, profile: AdminUser | null }[]>([]);
    const [searchUsername, setSearchUsername] = useState('');
    const [searchResults, setSearchResults] = useState<AdminUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, posts: 0, reports: 0, admins: 0 });

    useEffect(() => {
        if (isAdmin) loadData();
    }, [isAdmin, tab]);

    async function loadData() {
        setLoading(true);
        try {
            if (tab === 'users') {
                const { data, error } = await supabase.from('profiles').select('*');
                console.log('Admin users fetch:', { data, error });
                setUsers(data || []);
            } else if (tab === 'posts') {
                const { data, error } = await supabase.from('posts').select('*, author:profiles(username, full_name)').order('created_at', { ascending: false });
                console.log('Admin posts fetch:', { data, error });
                setPosts(data || []);
            } else if (tab === 'admins') {
                const { data } = await supabase
                    .from('admin_users')
                    .select('user_id, created_at, profile:profiles(*)')
                    .order('created_at', { ascending: false });
                
                // Supabase join returns an array for 1:1 sometimes depending on foreign keys, so we map it to single object to fit the type
                setAdmins(data?.map(d => ({
                    ...d,
                    profile: Array.isArray(d.profile) ? d.profile[0] : d.profile
                })) || []);
            } else {
                const data = await getAllReports();
                setReports(data);
            }

            // Stats
            const [u, p, r, a] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('reports').select('*', { count: 'exact', head: true }),
                supabase.from('admin_users').select('*', { count: 'exact', head: true }),
            ]);
            setStats({ users: u.count || 0, posts: p.count || 0, reports: r.count || 0, admins: a.count || 1 });
        } catch (e) {
            console.error('Admin load error:', e);
        }
        setLoading(false);
    }

    async function handleDeletePost(postId: string) {
        if (!confirm(t('admin.confirmDelete'))) return;
        await supabase.from('posts').delete().eq('id', postId);
        setPosts(prev => prev.filter(p => p.id !== postId));
        setStats(prev => ({ ...prev, posts: prev.posts - 1 }));
    }

    async function handleReportAction(reportId: string, status: 'reviewed' | 'resolved') {
        const ok = await updateReportStatus(reportId, status);
        if (ok) setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    }

    async function handleDeleteReportedPost(postId: string, reportId: string) {
        if (!confirm(t('admin.confirmDelete'))) return;
        await supabase.from('posts').delete().eq('id', postId);
        await updateReportStatus(reportId, 'resolved');
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' as const } : r));
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchUsername.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .ilike('username', `%${searchUsername.trim()}%`)
                .limit(5);
            setSearchResults(data || []);
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchUsername]);

    async function handleAddAdmin(userId: string) {
        setLoading(true);
        const { error } = await supabase.from('admin_users').insert({ user_id: userId });
        if (!error) {
            setSearchUsername('');
            setSearchResults([]);
            loadData();
        } else {
            setLoading(false);
            console.error('Failed to add admin', error);
        }
    }

    async function handleRemoveAdmin(userId: string) {
        if (!confirm('Haqiqatan ham bu adminni o`chirmoqchimisiz?')) return;
        setLoading(true);
        await supabase.from('admin_users').delete().eq('user_id', userId);
        loadData();
    }

    if (!isAdmin) {
        return (
            <div className="text-center py-20">
                <Shield className="w-16 h-16 text-slate-300 dark:text-slate-600 dark:text-zinc-300 mx-auto mb-4" />
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-2">{t('admin.accessDenied')}</p>
                <p className="text-sm text-slate-400">{t('admin.accessDeniedDesc')}</p>
            </div>
        );
    }

    const tabs: { key: Tab; icon: typeof Users; labelKey: string; count: number }[] = [
        { key: 'users', icon: Users, labelKey: 'admin.users', count: stats.users },
        { key: 'posts', icon: FileText, labelKey: 'admin.posts', count: stats.posts },
        { key: 'reports', icon: Flag, labelKey: 'admin.reports', count: stats.reports },
        { key: 'admins', icon: Shield, labelKey: 'Admins', count: stats.admins },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{t('admin.title')}</h1>
                    <p className="text-sm text-slate-400">{t('admin.subtitle')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {tabs.map(tb => (
                    <Card key={tb.key} className="p-4 text-center border-slate-100 dark:border-white/10">
                        <tb.icon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{tb.count}</p>
                        <p className="text-xs text-slate-400">{t(tb.labelKey)}</p>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map(tb => (
                    <button
                        key={tb.key}
                        onClick={() => setTab(tb.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === tb.key
                            ? 'bg-blue-600 text-white shadow-md dark:shadow-none shadow-blue-600/20'
                            : 'bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <tb.icon className="w-4 h-4" />
                        {t(tb.labelKey)}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Users Tab */}
                    {tab === 'users' && users.map(u => (
                        <Link key={u.id} to={`/user/${u.id}`}>
                            <Card className="p-4 flex items-center gap-4 border-slate-100 dark:border-white/10 hover:shadow-md dark:shadow-none hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer">
                                <img
                                    src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                                    alt=""
                                    className="w-12 h-12 rounded-full bg-slate-100 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-zinc-50 text-sm">{u.full_name || u.username}</p>
                                    <p className="text-xs text-slate-400 mb-1">@{u.username}</p>
                                    {u.bio && <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1">{u.bio}</p>}
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        {u.location && (
                                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                <MapPin className="w-3 h-3" /> {u.location}
                                            </span>
                                        )}
                                        {u.website && (
                                            <span className="flex items-center gap-1 text-[11px] text-blue-500">
                                                <Globe className="w-3 h-3" /> {u.website}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}

                    {/* Posts Tab */}
                    {tab === 'posts' && posts.map(p => (
                        <Card key={p.id} className="p-4 flex items-center gap-4 border-slate-100 dark:border-white/10">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 dark:text-zinc-50 text-sm truncate">{p.title}</p>
                                <p className="text-xs text-slate-400">
                                    {p.author?.full_name || p.author?.username || 'Unknown'} • {new Date(p.created_at).toLocaleDateString()} • ❤️ {p.likes_count || 0}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePost(p.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}

                    {/* Reports Tab */}
                    {tab === 'reports' && (reports.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-[#111111] dark:border-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-zinc-400 font-medium">{t('admin.noReports')}</p>
                        </div>
                    ) : reports.map(r => (
                        <Card key={r.id} className={`p-4 border-slate-100 dark:border-white/10 ${r.status === 'pending' ? 'border-l-4 border-l-red-500' : r.status === 'reviewed' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-green-500'}`}>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${r.status === 'pending' ? 'text-red-500' : r.status === 'reviewed' ? 'text-amber-500' : 'text-green-500'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.status === 'pending' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                                            r.status === 'reviewed' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                                                'bg-green-100 dark:bg-green-900/30 text-green-600'
                                            }`}>
                                            {r.status}
                                        </span>
                                        <span className="text-xs text-slate-400">{t(`report.reason.${r.reason}`)}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-zinc-300">{r.description || '—'}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {t('admin.reportedBy')}: {r.reporter?.full_name || r.reporter?.username || '?'} • {new Date(r.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                {r.status !== 'resolved' && (
                                    <div className="flex gap-1.5 flex-shrink-0">
                                        {r.status === 'pending' && (
                                            <Button variant="ghost" size="sm" onClick={() => handleReportAction(r.id, 'reviewed')} className="text-amber-600">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => handleReportAction(r.id, 'resolved')} className="text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                        {r.post_id && (
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteReportedPost(r.post_id!, r.id)} className="text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    )))}

                    {/* Admins Tab */}
                    {tab === 'admins' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchUsername}
                                    onChange={e => setSearchUsername(e.target.value)}
                                    placeholder="Foydalanuvchi qidirish (username)..."
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111111] rounded-xl text-sm text-slate-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                {isSearching && <div className="absolute right-4 top-3.5 w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                                
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden">
                                        {searchResults.map(user => (
                                            <div key={user.id} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-zinc-50 text-sm">{user.full_name || '@' + user.username}</p>
                                                        <p className="text-xs text-slate-400">@{user.username}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" onClick={() => handleAddAdmin(user.id)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 h-auto text-xs">
                                                    Admin qilish
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2 mt-6">
                                <h3 className="font-bold text-slate-900 dark:text-zinc-50 text-sm mb-3">Joriy Adminlar</h3>
                                {admins.map(a => (
                                    <Card key={a.user_id} className="p-4 flex items-center justify-between border-slate-100 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={a.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.profile?.username}`} alt="" className="w-10 h-10 rounded-full bg-slate-100" />
                                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-[#111111]">
                                                    <Shield className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-zinc-50 text-sm">{a.profile?.full_name || '@' + a.profile?.username}</p>
                                                <p className="text-xs text-slate-400">@{a.profile?.username} • Qo'shilgan: {new Date(a.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveAdmin(a.user_id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
