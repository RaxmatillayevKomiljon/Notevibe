import { supabase } from './supabase';

/**
 * Toggle follow for a user via RPC (bypasses RLS issues).
 * Returns true if now following, false if unfollowed.
 */
export async function toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('toggle_follow_rpc', {
        follower_uuid: followerId,
        following_uuid: followingId
    });

    if (error) {
        console.error('toggleFollow RPC error:', error);
        throw error;
    }

    // RPC returns true if now following, false if unfollowed
    return data as boolean;
}

/**
 * Get the set of user IDs that the current user follows.
 * Only checks among the given candidateIds for efficiency.
 */
export async function getFollowingIds(userId: string, candidateIds: string[]): Promise<Set<string>> {
    if (candidateIds.length === 0) return new Set();

    const { data } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId)
        .in('following_id', candidateIds);

    return new Set((data || []).map(f => f.following_id));
}

/**
 * Get follower and following counts for a user.
 */
export async function getFollowCounts(userId: string): Promise<{ followers: number; following: number }> {
    try {
        const followersRes = await supabase
            .from('follows')
            .select('id', { count: 'exact', head: true })
            .eq('following_id', userId);

        const followingRes = await supabase
            .from('follows')
            .select('id', { count: 'exact', head: true })
            .eq('follower_id', userId);

        return {
            followers: followersRes.count ?? 0,
            following: followingRes.count ?? 0
        };
    } catch (err) {
        console.error('getFollowCounts error:', err);
        return { followers: 0, following: 0 };
    }
}
