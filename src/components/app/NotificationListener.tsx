import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { requestNotificationPermission, sendBrowserNotification, getNotificationPermissionStatus } from '../../lib/pushNotifications';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * NotificationListener — jonli bildirishnomalarni tinglaydi va
 * brauzer push xabarnomasi sifatida ko'rsatadi.
 * AppLayout ichiga joylashtiriladi.
 */
export function NotificationListener() {
    const { user } = useAuth();
    const [showBanner, setShowBanner] = useState(false);
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    // Foydalanuvchi kirganda ruxsat so'rash banneri
    useEffect(() => {
        if (!user) return;

        const status = getNotificationPermissionStatus();
        if (status === 'default') {
            // 3 soniyadan keyin banner ko'rsat
            const timer = setTimeout(() => setShowBanner(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    // Supabase Realtime orqali yangi bildirishnomalarni tinglash
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('user-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                async (payload) => {
                    const newNotif = payload.new as any;

                    // Actor ma'lumotlarini olish
                    let actorName = 'Kimdir';
                    let postTitle = '';

                    if (newNotif.actor_id) {
                        const { data: actor } = await supabase
                            .from('profiles')
                            .select('username, full_name')
                            .eq('id', newNotif.actor_id)
                            .single();

                        if (actor) {
                            actorName = actor.full_name || actor.username || 'Kimdir';
                        }
                    }

                    if (newNotif.post_id) {
                        const { data: post } = await supabase
                            .from('posts')
                            .select('title')
                            .eq('id', newNotif.post_id)
                            .single();

                        if (post) {
                            postTitle = post.title;
                        }
                    }

                    // Brauzer bildirishnomasini yuborish
                    sendBrowserNotification(newNotif.type, actorName, postTitle);
                }
            )
            .subscribe();

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [user]);

    async function handleEnableNotifications() {
        const granted = await requestNotificationPermission();
        if (granted) {
            setShowBanner(false);
        } else {
            setShowBanner(false);
        }
    }

    if (!showBanner) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md animate-in slide-in-from-top duration-500">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl shrink-0">
                    <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        Bildirishnomalarni yoqing! 🔔
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Kimdir sizga Kudos bersa yoki izoh yozsa, xuddi Telegram kabi xabar keladi!
                    </p>
                    <div className="flex gap-2 mt-3">
                        <Button
                            size="sm"
                            onClick={handleEnableNotifications}
                            className="text-xs px-3 py-1.5"
                        >
                            <Bell className="w-3.5 h-3.5 mr-1.5" />
                            Yoqish
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBanner(false)}
                            className="text-xs px-3 py-1.5 text-slate-400"
                        >
                            <BellOff className="w-3.5 h-3.5 mr-1.5" />
                            Keyinroq
                        </Button>
                    </div>
                </div>
                <button
                    onClick={() => setShowBanner(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
