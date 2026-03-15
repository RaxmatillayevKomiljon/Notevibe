import { supabase } from './supabase';

export interface Notification {
    id: string;
    user_id: string;
    type: 'follow' | 'kudos' | 'comment' | 'book_request' | 'borrow_request' | 'book_approved' | 'borrow_approved';
    actor_id: string;
    post_id: string | null;
    read: boolean;
    created_at: string;
    actor?: { username: string; full_name: string | null; avatar_url: string | null };
    post?: { title: string } | null;
}

/**
 * Fetch notifications for a user, newest first.
 */
export async function getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
        .from('notifications')
        .select(`
            *,
            actor:profiles!notifications_actor_id_fkey(username, full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        // Fallback without join
        console.warn('Notifications fetch with join failed:', error.message);
        const { data: plain } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);
        return (plain || []) as Notification[];
    }
    return data || [];
}

/**
 * Get unread notification count.
 */
export async function getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) return 0;
    return count || 0;
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(notifId: string): Promise<void> {
    await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId);
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllAsRead(userId: string): Promise<void> {
    await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
}

/**
 * Create a notification. Called when someone kudos, comments, or follows.
 * Does NOT notify yourself.
 */
export async function createNotification(
    type: 'follow' | 'kudos' | 'comment' | 'book_request' | 'borrow_request' | 'book_approved' | 'borrow_approved',
    actorId: string,
    targetUserId: string,
    postId?: string
): Promise<void> {
    // Don't notify yourself
    if (actorId === targetUserId) return;

    await supabase
        .from('notifications')
        .insert({
            user_id: targetUserId,
            type,
            actor_id: actorId,
            post_id: postId || null,
        });
}
