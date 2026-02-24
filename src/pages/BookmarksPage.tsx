import { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bookmark, BookmarkX, ThumbsUp, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';

const BOOKMARKS_KEY = 'notevibe_bookmarks';

function getBookmarkIds(): string[] {
    try {
        const raw = localStorage.getItem(BOOKMARKS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveBookmarkIds(ids: string[]) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
}

export function toggleBookmark(postId: string): boolean {
    const ids = getBookmarkIds();
    const index = ids.indexOf(postId);
    if (index > -1) {
        ids.splice(index, 1);
        saveBookmarkIds(ids);
        return false; // removed
    } else {
        ids.push(postId);
        saveBookmarkIds(ids);
        return true; // added
    }
}

export function isBookmarked(postId: string): boolean {
    return getBookmarkIds().includes(postId);
}

export function BookmarksPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookmarkIds, setBookmarkIds] = useState<string[]>(getBookmarkIds());

    const fetchBookmarkedPosts = useCallback(async () => {
        try {
            setLoading(true);
            const ids = getBookmarkIds();
            setBookmarkIds(ids);

            if (ids.length === 0) {
                setPosts([]);
                return;
            }

            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    author:profiles(username, full_name, avatar_url)
                `)
                .in('id', ids)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookmarkedPosts();
    }, [fetchBookmarkedPosts]);

    function handleUnbookmark(postId: string) {
        toggleBookmark(postId);
        const newIds = getBookmarkIds();
        setBookmarkIds(newIds);
        setPosts(prev => prev.filter(p => p.id !== postId));
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Bookmark className="w-7 h-7 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">{t('bookmarks.title')}</h1>
                </div>
                <p className="text-slate-500">Saqlangan notelaringiz ({bookmarkIds.length})</p>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16 text-slate-400">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        {t('common.loading')}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Bookmark className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium mb-2">{t('bookmarks.empty')}</p>
                        <p className="text-sm text-slate-400 mb-6">
                            {t('bookmarks.emptyDesc')}
                        </p>
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            Dashboard ga o'tish
                        </Button>
                    </div>
                ) : (
                    posts.map(post => (
                        <Card key={post.id} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'User'}`}
                                        alt={post.author?.full_name || 'User'}
                                        className="w-9 h-9 rounded-full bg-slate-100"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{post.author?.full_name || post.author?.username || 'Anonymous'}</p>
                                        <p className="text-xs text-slate-400">@{post.author?.username} • {new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUnbookmark(post.id)}
                                    className="p-2 text-amber-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Saqlangandan olib tashlash"
                                >
                                    <BookmarkX className="w-5 h-5" />
                                </button>
                            </div>

                            <h2 className="text-lg font-bold text-slate-900 mb-2">{post.title}</h2>
                            {post.content && (
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">{post.content}</p>
                            )}

                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-5 pt-3 border-t border-slate-50 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <ThumbsUp className="w-4 h-4" /> {post.likes_count || 0}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4" /> 0
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
