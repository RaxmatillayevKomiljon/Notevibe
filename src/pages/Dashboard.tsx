import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Flame, MessageSquare, ThumbsUp, Share2, MoreHorizontal, Bookmark, Flag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { toggleBookmark, isBookmarked } from './BookmarksPage';
import { toggleKudos, getUserKudos } from '../lib/kudos';
import { toggleFollow, getFollowingIds } from '../lib/follows';
import { useAuth } from '../components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { getCommentCounts } from '../lib/comments';
import { CommentsSection } from '../components/app/CommentsSection';
import { createNotification } from '../lib/notifications';
import { ReportModal } from '../components/app/ReportModal';

export function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<{ id: string; username: string; full_name: string | null; avatar_url: string | null }[]>([]);
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
    const [followLoading, setFollowLoading] = useState<Set<string>>(new Set());
    const [trendingTags, setTrendingTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [kudosGiven, setKudosGiven] = useState<Set<string>>(new Set());
    const [kudosLoading, setKudosLoading] = useState<Set<string>>(new Set());
    const [commentCounts, setCommentCounts] = useState<Map<string, number>>(new Map());
    const [openComments, setOpenComments] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState<string | null>(null);
    const [reportPostId, setReportPostId] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);

            // 1. Fetch Posts
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select(`
                    *,
                    author:profiles(username, full_name, avatar_url)
                `)
                .order('created_at', { ascending: false });

            if (postsError) throw postsError;
            const fetchedPosts = postsData || [];
            setPosts(fetchedPosts);

            // Initialize bookmark state
            const bIds = new Set<string>();
            fetchedPosts.forEach(p => {
                if (isBookmarked(p.id)) bIds.add(p.id);
            });
            setBookmarkedIds(bIds);

            // Initialize kudos state
            if (user) {
                const postIds = fetchedPosts.map(p => p.id);
                const givenKudos = await getUserKudos(user.id, postIds);
                setKudosGiven(givenKudos);
            }

            // Initialize comment counts
            if (fetchedPosts.length > 0) {
                const postIds = fetchedPosts.map(p => p.id);
                const counts = await getCommentCounts(postIds);
                setCommentCounts(counts);
            }

            // 2. Process Tags for Trending
            const allTags = fetchedPosts.flatMap(p => p.tags || []);
            const uniqueTags = Array.from(new Set(allTags)).slice(0, 5);
            setTrendingTags(uniqueTags);

            // 3. Fetch Suggested Users (exclude current user)
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .neq('id', user?.id || '')
                .limit(5);

            if (!usersError && usersData) {
                setSuggestedUsers(usersData);
                // Load follow state
                if (user) {
                    const ids = usersData.map(u => u.id);
                    const followSet = await getFollowingIds(user.id, ids);
                    setFollowingIds(followSet);
                }
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleToggleBookmark(postId: string) {
        const isNowBookmarked = toggleBookmark(postId);
        setBookmarkedIds(prev => {
            const next = new Set(prev);
            if (isNowBookmarked) {
                next.add(postId);
            } else {
                next.delete(postId);
            }
            return next;
        });
    }

    function toggleComments(postId: string) {
        setOpenComments(prev => {
            const next = new Set(prev);
            if (next.has(postId)) next.delete(postId);
            else next.add(postId);
            return next;
        });
    }

    function handleShare(postId: string) {
        const url = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(url).then(() => {
            setToast(t('dashboard.linkCopied'));
            setTimeout(() => setToast(null), 2000);
        }).catch(() => {
            // Fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setToast(t('dashboard.linkCopied'));
            setTimeout(() => setToast(null), 2000);
        });
    }

    async function handleToggleKudos(postId: string) {
        if (!user || kudosLoading.has(postId)) return;

        setKudosLoading(prev => new Set(prev).add(postId));

        try {
            const { given, newCount } = await toggleKudos(postId, user.id);

            // Update kudos given state
            setKudosGiven(prev => {
                const next = new Set(prev);
                if (given) {
                    next.add(postId);
                } else {
                    next.delete(postId);
                }
                return next;
            });

            // Update post's kudos count
            setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, likes_count: newCount } : p
            ));

            // Send notification to post author
            if (given) {
                const post = posts.find(p => p.id === postId);
                if (post?.author_id) {
                    createNotification('kudos', user.id, post.author_id, postId);
                }
            }
        } catch (error) {
            console.error('Error toggling kudos:', error);
        } finally {
            setKudosLoading(prev => {
                const next = new Set(prev);
                next.delete(postId);
                return next;
            });
        }
    }

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toast}
                </div>
            )}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header & Search */}
                    <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 dark:bg-[#050505]/95 backdrop-blur z-10 py-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{t('dashboard.feed')}</h1>
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-400" />
                            <input
                                type="text"
                                placeholder={t('dashboard.search')}
                                className="pl-9 pr-4 py-2 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    {/* Categories / Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {[t('dashboard.all'), ...trendingTags].map((cat, i) => (
                            <button
                                key={i}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Posts */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-10 text-slate-500 dark:text-zinc-400">{t('dashboard.loading')}</div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 dark:text-zinc-400 bg-white rounded-2xl border border-slate-200">
                                <p>{t('dashboard.noPosts')}</p>
                                <p className="text-sm">{t('dashboard.beFirst')}</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <Card key={post.id} className="p-6 border-slate-100 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Link to={`/user/${post.author_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                <img
                                                    src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'User'}`}
                                                    alt={post.author?.full_name || 'User'}
                                                    className="w-10 h-10 rounded-full bg-slate-100"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-zinc-50 text-sm hover:text-blue-600 transition-colors">{post.author?.full_name || post.author?.username || 'Anonymous'}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                        @{post.author?.username} • {new Date(post.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <button onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)} className="text-slate-400 hover:text-slate-600 dark:text-zinc-300">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                            {menuOpen === post.id && (
                                                <div className="absolute right-0 top-8 bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg py-1 z-20 min-w-[160px]">
                                                    <button
                                                        onClick={() => { setReportPostId(post.id); setMenuOpen(null); }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                        {t('report.title')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                                            {post.content}
                                        </p>
                                    </div>

                                    {post.tags && post.tags.map(tag => (
                                        <span key={tag} className="inline-block bg-slate-100 text-slate-600 dark:text-zinc-300 text-xs px-2 py-1 rounded-md mr-2 mb-4 font-medium">
                                            #{tag}
                                        </span>
                                    ))}

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => handleToggleKudos(post.id)}
                                                disabled={kudosLoading.has(post.id)}
                                                className={`flex items-center gap-2 transition-colors text-sm group ${kudosGiven.has(post.id)
                                                    ? 'text-blue-600'
                                                    : 'text-slate-500 dark:text-zinc-400 hover:text-blue-600'
                                                    }`}
                                            >
                                                <ThumbsUp className={`w-5 h-5 transition-all ${kudosGiven.has(post.id) ? 'fill-blue-600' : 'group-hover:scale-110'
                                                    } ${kudosLoading.has(post.id) ? 'animate-pulse' : ''}`} />
                                                <span>{post.likes_count || 0}</span>
                                            </button>
                                            <button
                                                onClick={() => toggleComments(post.id)}
                                                className={`flex items-center gap-2 transition-colors text-sm group ${openComments.has(post.id) ? 'text-blue-600' : 'text-slate-500 dark:text-zinc-400 hover:text-blue-500'
                                                    }`}
                                            >
                                                <MessageSquare className={`w-5 h-5 ${openComments.has(post.id) ? 'fill-blue-100' : ''}`} />
                                                <span>{commentCounts.get(post.id) || 0}</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                            <button
                                                onClick={() => handleToggleBookmark(post.id)}
                                                className={`p-1.5 rounded-lg transition-colors ${bookmarkedIds.has(post.id)
                                                    ? 'text-amber-500 bg-amber-50'
                                                    : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                                                    }`}
                                                title={bookmarkedIds.has(post.id) ? t('dashboard.unsave') : t('dashboard.save')}
                                            >
                                                <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(post.id) ? 'fill-amber-500' : ''}`} />
                                            </button>
                                            <span>3 min {t('dashboard.readTime')}</span>
                                            <button onClick={() => handleShare(post.id)} className="hover:text-slate-800 dark:text-zinc-100 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Inline Comments */}
                                    {openComments.has(post.id) && (
                                        <CommentsSection
                                            postId={post.id}
                                            postAuthorId={post.author_id}
                                            onCountChange={(count) => setCommentCounts(prev => {
                                                const next = new Map(prev);
                                                next.set(post.id, count);
                                                return next;
                                            })}
                                        />
                                    )}
                                </Card>
                            )))
                        }
                    </div>
                </div>

                {/* Right Sidebar (Trending & Recommendations) */}
                <div className="hidden lg:block space-y-6">
                    {/* Trending Topics */}
                    <Card className="p-5 border-slate-100 shadow-sm dark:shadow-none sticky top-6">
                        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-zinc-50 font-bold">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <h3>{t('dashboard.trending')}</h3>
                        </div>
                        {trendingTags.length === 0 ? (
                            <p className="text-sm text-slate-400">{t('dashboard.noTopics')}</p>
                        ) : (
                            <div className="space-y-4">
                                {trendingTags.map((tag, i) => (
                                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 transition-colors">#{tag}</p>
                                            <p className="text-xs text-slate-400">1.2k views</p>
                                        </div>
                                        <MoreHorizontal className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Suggested Users */}
                    <Card className="p-5 border-slate-100 shadow-sm dark:shadow-none sticky top-64">
                        <h3 className="font-bold text-slate-900 dark:text-zinc-50 mb-4">{t('dashboard.suggested')}</h3>
                        {suggestedUsers.length === 0 ? (
                            <p className="text-sm text-slate-400">{t('dashboard.noSuggestions')}</p>
                        ) : (
                            <div className="space-y-4">
                                {suggestedUsers.map((suggestedUser, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Link to={`/user/${suggestedUser.id}`} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                                            <img
                                                src={suggestedUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestedUser.username}`}
                                                alt={suggestedUser.full_name || suggestedUser.username}
                                                className="w-9 h-9 rounded-full bg-slate-100"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-zinc-50 truncate hover:text-blue-600 transition-colors">{suggestedUser.full_name || suggestedUser.username}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">@{suggestedUser.username}</p>
                                            </div>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant={followingIds.has(suggestedUser.id) ? 'primary' : 'outline'}
                                            className={`h-8 px-3 text-xs transition-all ${followingIds.has(suggestedUser.id)
                                                ? 'bg-blue-600 text-white hover:bg-red-500'
                                                : ''
                                                }`}
                                            disabled={followLoading.has(suggestedUser.id)}
                                            onClick={async () => {
                                                const targetId = suggestedUser.id;
                                                if (!user || !targetId || followLoading.has(targetId)) return;
                                                setFollowLoading(prev => new Set(prev).add(targetId));
                                                try {
                                                    const isNowFollowing = await toggleFollow(user.id, targetId);
                                                    setFollowingIds(prev => {
                                                        const next = new Set(prev);
                                                        if (isNowFollowing) next.add(targetId);
                                                        else next.delete(targetId);
                                                        return next;
                                                    });
                                                } catch (e) {
                                                    console.error('Follow error:', e);
                                                } finally {
                                                    setFollowLoading(prev => {
                                                        const next = new Set(prev);
                                                        next.delete(targetId);
                                                        return next;
                                                    });
                                                }
                                            }}
                                        >
                                            {followLoading.has(suggestedUser.id)
                                                ? '...'
                                                : followingIds.has(suggestedUser.id)
                                                    ? t('dashboard.following')
                                                    : t('dashboard.followBtn')
                                            }
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Report Modal */}
            {reportPostId && (
                <ReportModal
                    type="post"
                    targetId={reportPostId}
                    onClose={() => setReportPostId(null)}
                    onReported={() => {
                        setToast(t('report.sent'));
                        setTimeout(() => setToast(null), 2000);
                    }}
                />
            )}
        </>
    );
}
