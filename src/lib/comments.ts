import { supabase } from './supabase';
import { Comment } from './types';

/**
 * Fetch comments for a post, newest first, with author profile.
 */
export async function getComments(postId: string): Promise<Comment[]> {
    // Try with profile join first
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            author:profiles(username, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (!error && data) return data;

    // Fallback: fetch without join
    console.warn('Comments join failed, fetching without profile:', error?.message);
    const { data: plain, error: plainError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (plainError) {
        console.error('Error fetching comments:', plainError);
        return [];
    }
    return plain || [];
}

/**
 * Add a comment to a post.
 */
export async function addComment(postId: string, userId: string, content: string): Promise<Comment | null> {
    // Step 1: Insert the comment
    const { data: inserted, error: insertError } = await supabase
        .from('comments')
        .insert({ post_id: postId, user_id: userId, content })
        .select('*')
        .single();

    if (insertError || !inserted) {
        console.error('Error adding comment:', insertError);
        return null;
    }

    // Step 2: Fetch the comment with author profile
    const { data: full, error: fetchError } = await supabase
        .from('comments')
        .select(`
            *,
            author:profiles!comments_user_id_fkey1(username, full_name, avatar_url)
        `)
        .eq('id', inserted.id)
        .single();

    if (fetchError || !full) {
        // Fallback: return without author join
        return inserted as Comment;
    }
    return full;
}

/**
 * Delete a comment by ID.
 */
export async function deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
    return true;
}

/**
 * Get comment counts for a list of post IDs.
 * Returns a Map of postId → count.
 */
export async function getCommentCounts(postIds: string[]): Promise<Map<string, number>> {
    const counts = new Map<string, number>();
    if (postIds.length === 0) return counts;

    // Supabase doesn't support group-by easily, so we fetch all comment IDs and count client-side
    const { data, error } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

    if (error) {
        console.error('Error fetching comment counts:', error);
        return counts;
    }

    for (const row of data || []) {
        counts.set(row.post_id, (counts.get(row.post_id) || 0) + 1);
    }
    return counts;
}
