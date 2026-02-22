import { supabase } from './supabase';

/**
 * Toggle follow for a user.
 * Returns true if now following, false if unfollowed.
 */
export async function toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    // Check if already following
    const { data: existing } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

    if (existing) {
        // Unfollow
        await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);
        return false;
    } else {
        // Follow
        await supabase
            .from('follows')
            .insert({ follower_id: followerId, following_id: followingId });
        return true;
    }
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
