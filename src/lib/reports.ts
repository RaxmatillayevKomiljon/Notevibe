import { supabase } from './supabase';

export type ReportReason = 'spam' | 'inappropriate' | 'harassment' | 'other';

export interface Report {
    id: string;
    reporter_id: string;
    post_id: string | null;
    comment_id: string | null;
    reason: ReportReason;
    description: string | null;
    status: 'pending' | 'reviewed' | 'resolved';
    created_at: string;
    reporter?: { username: string; full_name: string | null };
    post?: { title: string } | null;
}

export async function reportPost(
    reporterId: string,
    postId: string,
    reason: ReportReason,
    description?: string
): Promise<boolean> {
    const { error } = await supabase
        .from('reports')
        .insert({
            reporter_id: reporterId,
            post_id: postId,
            reason,
            description: description || null,
        });
    if (error) {
        console.error('Error reporting post:', error);
        return false;
    }
    return true;
}

export async function reportComment(
    reporterId: string,
    commentId: string,
    reason: ReportReason,
    description?: string
): Promise<boolean> {
    const { error } = await supabase
        .from('reports')
        .insert({
            reporter_id: reporterId,
            comment_id: commentId,
            reason,
            description: description || null,
        });
    if (error) {
        console.error('Error reporting comment:', error);
        return false;
    }
    return true;
}

/**
 * Fetch all reports (admin only — relies on RLS).
 */
export async function getAllReports(): Promise<Report[]> {
    const { data, error } = await supabase
        .from('reports')
        .select(`
            *,
            reporter:profiles!reports_reporter_id_fkey(username, full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        // Fallback without join
        const { data: plain } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });
        return (plain || []) as Report[];
    }
    return data || [];
}

export async function updateReportStatus(reportId: string, status: 'reviewed' | 'resolved'): Promise<boolean> {
    const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);
    if (error) {
        console.error('Error updating report:', error);
        return false;
    }
    return true;
}
