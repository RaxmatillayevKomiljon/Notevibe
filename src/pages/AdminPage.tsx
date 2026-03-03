import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Users, FileText, Flag, Trash2, CheckCircle, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthProvider';
import { useTranslation } from '../lib/i18n';
import { getAllReports, updateReportStatus } from '../lib/reports';
import type { Report } from '../lib/reports';

// Admin emails — add your admin email(s) here
const ADMIN_EMAILS = ['komiljonraxmatillayev5@gmail.com'];

type Tab = 'users' | 'posts' | 'reports';

interface AdminUser {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
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
    const { user } = useAuth();
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('users');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, posts: 0, reports: 0 });

    const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

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
            } else {
                const data = await getAllReports();
                setReports(data);
            }

            // Stats
            const [u, p, r] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('reports').select('*', { count: 'exact', head: true }),
            ]);
            setStats({ users: u.count || 0, posts: p.count || 0, reports: r.count || 0 });
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

    if (!isAdmin) {
        return (
            <div className="text-center py-20">
                <Shield className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('admin.accessDenied')}</p>
                <p className="text-sm text-slate-400">{t('admin.accessDeniedDesc')}</p>
            </div>
        );
    }

    const tabs: { key: Tab; icon: typeof Users; labelKey: string; count: number }[] = [
        { key: 'users', icon: Users, labelKey: 'admin.users', count: stats.users },
        { key: 'posts', icon: FileText, labelKey: 'admin.posts', count: stats.posts },
        { key: 'reports', icon: Flag, labelKey: 'admin.reports', count: stats.reports },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
                    <p className="text-sm text-slate-400">{t('admin.subtitle')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {tabs.map(tb => (
                    <Card key={tb.key} className="p-4 text-center border-slate-100 dark:border-slate-700">
                        <tb.icon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{tb.count}</p>
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
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                        <Card key={u.id} className="p-4 flex items-center gap-4 border-slate-100 dark:border-slate-700">
                            <img
                                src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                                alt=""
                                className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{u.full_name || u.username}</p>
                                <p className="text-xs text-slate-400">@{u.username} • {new Date(u.created_at).toLocaleDateString()}</p>
                            </div>
                        </Card>
                    ))}

                    {/* Posts Tab */}
                    {tab === 'posts' && posts.map(p => (
                        <Card key={p.id} className="p-4 flex items-center gap-4 border-slate-100 dark:border-slate-700">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{p.title}</p>
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
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('admin.noReports')}</p>
                        </div>
                    ) : reports.map(r => (
                        <Card key={r.id} className={`p-4 border-slate-100 dark:border-slate-700 ${r.status === 'pending' ? 'border-l-4 border-l-red-500' : r.status === 'reviewed' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-green-500'}`}>
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
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{r.description || '—'}</p>
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
                </div>
            )}
        </div>
    );
}
