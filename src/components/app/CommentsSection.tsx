import { useState, useEffect, useRef } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Comment } from '../../lib/types';
import { getComments, addComment, deleteComment } from '../../lib/comments';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from '../../lib/i18n';
import { createNotification } from '../../lib/notifications';

interface Props {
    postId: string;
    postAuthorId?: string;
    onCountChange?: (count: number) => void;
}

export function CommentsSection({ postId, postAuthorId, onCountChange }: Props) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadComments();
    }, [postId]);

    async function loadComments() {
        setLoading(true);
        const data = await getComments(postId);
        setComments(data);
        onCountChange?.(data.length);
        setLoading(false);
    }

    async function handleSend() {
        if (!user || !text.trim() || sending) return;
        setSending(true);
        const newComment = await addComment(postId, user.id, text.trim());
        if (newComment) {
            setComments(prev => [...prev, newComment]);
            onCountChange?.(comments.length + 1);
            setText('');
            // Notify post author
            if (postAuthorId) {
                createNotification('comment', user.id, postAuthorId, postId);
            }
        }
        setSending(false);
        inputRef.current?.focus();
    }

    async function handleDelete(commentId: string) {
        const ok = await deleteComment(commentId);
        if (ok) {
            setComments(prev => prev.filter(c => c.id !== commentId));
            onCountChange?.(comments.length - 1);
        }
    }

    function timeAgo(dateStr: string): string {
        const now = Date.now();
        const diff = now - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return t('comments.justNow');
        if (mins < 60) return `${mins} ${t('comments.minAgo')}`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} ${t('comments.hourAgo')}`;
        const days = Math.floor(hours / 24);
        return `${days} ${t('comments.dayAgo')}`;
    }

    return (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Comment Input */}
            {user && (
                <div className="flex items-center gap-2">
                    <img
                        src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt=""
                        className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"
                        referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder={t('comments.placeholder')}
                            className="w-full px-4 py-2.5 pr-12 bg-slate-50 dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/15 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-slate-900 dark:text-zinc-50 placeholder:text-slate-400"
                            disabled={sending}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!text.trim() || sending}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <Send className={`w-4 h-4 ${sending ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            ) : comments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-3">{t('comments.empty')}</p>
            ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-2.5 group">
                            <img
                                src={comment.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || 'u'}`}
                                alt=""
                                className="w-7 h-7 rounded-full bg-slate-100 flex-shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="bg-slate-50 dark:bg-[#111111] dark:border-white/5 rounded-2xl rounded-tl-md px-3.5 py-2.5">
                                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-50 mb-0.5">
                                        {comment.author?.full_name || comment.author?.username || 'User'}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed break-words">
                                        {comment.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 px-1">
                                    <span className="text-[11px] text-slate-400">{timeAgo(comment.created_at)}</span>
                                    {user?.id === comment.user_id && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-[11px] text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            {t('comments.delete')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
