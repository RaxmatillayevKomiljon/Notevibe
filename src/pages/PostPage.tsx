import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { useTranslation } from '../lib/i18n';
import { useAuth } from '../components/auth/AuthProvider';
import { ArrowLeft, MessageSquare, ThumbsUp, Bookmark } from 'lucide-react';
import { CommentsSection } from '../components/app/CommentsSection';

export function PostPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [kudosCount, setKudosCount] = useState(0);
    const [userKudos, setUserKudos] = useState<Set<string>>(new Set());
    const [kudosLoading, setKudosLoading] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(true); // Default open on single post page

    useEffect(() => {
        async function fetchPost() {
            if (!id) return;

            setLoading(true);
            try {
                // Fetch the post with author details
                const { data, error } = await supabase
                    .from('posts')
                    .select('*, author:profiles(*)')
                    .eq('id', id)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    setPost(data);
                    setKudosCount(data.kudos || 0);

                    if (user) {
                        const { data: interactionData } = await supabase
                            .from('post_interactions')
                            .select('post_id')
                            .eq('user_id', user.id)
                            .eq('interaction_type', 'kudos');

                        if (interactionData) {
                            setUserKudos(new Set(interactionData.map(d => d.post_id)));
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id, user]);

    const handleKudos = async () => {
        if (!user || !post || kudosLoading) return;

        setKudosLoading(true);
        const hasKudos = userKudos.has(post.id);

        try {
            if (hasKudos) {
                await supabase
                    .from('post_interactions')
                    .delete()
                    .eq('post_id', post.id)
                    .eq('user_id', user.id)
                    .eq('interaction_type', 'kudos');
            } else {
                await supabase
                    .from('post_interactions')
                    .insert({ post_id: post.id, user_id: user.id, interaction_type: 'kudos' });
            }

            setKudosCount(prev => hasKudos ? prev - 1 : prev + 1);
            setUserKudos(prev => {
                const next = new Set(prev);
                if (hasKudos) next.delete(post.id);
                else next.add(post.id);
                return next;
            });
        } catch (err) {
            console.error('Error toggling kudos:', err);
        }
        setKudosLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-20 bg-white dark:bg-[#111111] dark:border-white/5 rounded-3xl border border-slate-200">
                <p className="text-slate-500 dark:text-zinc-400 mb-4">{t('post.notFound') || 'Post not found.'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline font-medium"
                >
                    &larr; {t('post.back') || 'Go back'}
                </button>
            </div>
        );
    }

    const hasKudos = user ? userKudos.has(post.id) : false;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 transition-colors font-medium mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                {t('post.back') || 'Back'}
            </button>

            {/* Main Post Card */}
            <article className="bg-white dark:bg-[#111111] dark:border-white/5 rounded-3xl border border-slate-200 shadow-sm dark:shadow-none overflow-hidden p-6 md:p-8">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to={`/user/${post.author_id}`} className="shrink-0 flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'User'}`}
                            alt={post.author?.full_name || 'User'}
                            className="w-12 h-12 rounded-full border border-slate-100 dark:border-white/10"
                        />
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-zinc-50 text-base md:text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {post.author?.full_name || post.author?.username || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">
                                @{post.author?.username} • {new Date(post.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Content */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-4 whitespace-pre-wrap">
                    {post.title}
                </h1>

                <div className="text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap text-base md:text-lg mb-8">
                    {post.content}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map(tag => (
                            <Link
                                key={tag}
                                to={`/explore?tag=${tag}`}
                                className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Interactive bar */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-white/10">
                    <button
                        onClick={handleKudos}
                        disabled={kudosLoading || !user}
                        className={`flex items-center gap-2 transition-colors ${hasKudos
                            ? 'text-blue-600'
                            : 'text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'
                            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ThumbsUp className={`w-5 h-5 ${hasKudos ? 'fill-current' : ''}`} />
                        <span className="font-medium text-slate-900 dark:text-zinc-50">{kudosCount}</span>
                    </button>

                    <button
                        onClick={() => setCommentsOpen(!commentsOpen)}
                        className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium text-slate-900 dark:text-zinc-50">{post.comment_count || 0}</span>
                    </button>

                    <button className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-auto">
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>
            </article>

            {/* Comments Section */}
            {commentsOpen && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <CommentsSection postId={post.id} />
                </div>
            )}
        </div>
    );
}
