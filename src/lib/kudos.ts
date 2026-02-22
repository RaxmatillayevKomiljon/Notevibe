import { supabase } from './supabase';

/**
 * Toggle kudos for a post (give or remove).
 * Returns the new kudos state: true = given, false = removed.
 */
export async function toggleKudos(postId: string, userId: string): Promise<{ given: boolean; newCount: number }> {
    // Check if already given
    const { data: existing } = await supabase
        .from('kudos')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existing) {
        // Remove kudos
        await supabase
            .from('kudos')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);

        // Decrement count
        await supabase.rpc('decrement_kudos', { post_id_arg: postId });

        // Get updated count
        const { data: post } = await supabase
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();

        return { given: false, newCount: post?.likes_count || 0 };
    } else {
        // Give kudos
        await supabase
            .from('kudos')
            .insert({ post_id: postId, user_id: userId });

        // Increment count
        await supabase.rpc('increment_kudos', { post_id_arg: postId });

        // Get updated count
        const { data: post } = await supabase
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();

        return { given: true, newCount: post?.likes_count || 0 };
    }
}

/**
 * Check which posts the user has given kudos to.
 * Returns a Set of post IDs.
 */
export async function getUserKudos(userId: string, postIds: string[]): Promise<Set<string>> {
    if (postIds.length === 0) return new Set();

    const { data } = await supabase
        .from('kudos')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

    return new Set((data || []).map(k => k.post_id));
}
