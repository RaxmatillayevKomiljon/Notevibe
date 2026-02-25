import { useState, useEffect } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Check, CheckCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../components/auth/AuthProvider';
import { useTranslation } from '../lib/i18n';
import { Notification, getNotifications, markAsRead, markAllAsRead } from '../lib/notifications';
import { Link } from 'react-router-dom';

export function NotificationsPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) loadNotifications();
    }, [user]);

    async function loadNotifications() {
        if (!user) return;
        setLoading(true);
        const data = await getNotifications(user.id);
        setNotifications(data);
        setLoading(false);
    }

    async function handleMarkAllRead() {
        if (!user) return;
        await markAllAsRead(user.id);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    async function handleMarkRead(id: string) {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }

    function timeAgo(dateStr: string): string {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return t('comments.justNow');
        if (mins < 60) return `${mins} ${t('comments.minAgo')}`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} ${t('comments.hourAgo')}`;
        const days = Math.floor(hours / 24);
        return `${days} ${t('comments.dayAgo')}`;
    }

    function getIcon(type: string) {
        switch (type) {
            case 'kudos': return <Heart className="w-5 h-5 text-rose-500" />;
            case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-emerald-500" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    }

    function getMessage(n: Notification): string {
        const name = n.actor?.full_name || n.actor?.username || t('dashboard.anonymous');
        switch (n.type) {
            case 'kudos': return `${name} ${t('notifications.kudosMsg')}`;
            case 'comment': return `${name} ${t('notifications.commentMsg')}`;
            case 'follow': return `${name} ${t('notifications.followMsg')}`;
            default: return name;
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell className="w-7 h-7 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('notifications.title')}</h1>
                    {unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-blue-600">
                        <CheckCheck className="w-4 h-4 mr-1" />
                        {t('notifications.markAllRead')}
                    </Button>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">{t('common.loading')}</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Bell className="w-16 h-16 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('notifications.empty')}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t('notifications.emptyDesc')}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => !n.read && handleMarkRead(n.id)}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer ${n.read
                                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                                    : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800'
                                }`}
                        >
                            {/* Actor Avatar */}
                            <Link to={`/user/${n.actor_id}`} onClick={e => e.stopPropagation()}>
                                <img
                                    src={n.actor?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.actor?.username || 'u'}`}
                                    alt=""
                                    className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"
                                />
                            </Link>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {getIcon(n.type)}
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug">
                                        {getMessage(n)}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-400">{timeAgo(n.created_at)}</p>
                            </div>

                            {/* Read indicator */}
                            {!n.read && (
                                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                            )}
                            {n.read && (
                                <Check className="w-4 h-4 text-slate-300 flex-shrink-0 mt-2" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
