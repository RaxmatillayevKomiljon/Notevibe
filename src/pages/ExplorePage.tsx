import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Search, ThumbsUp, MessageSquare, TrendingUp, Filter, ArrowUpDown, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { getCommentCounts } from '../lib/comments';
import { toggleKudos, getUserKudos } from '../lib/kudos';
import { useAuth } from '../components/auth/AuthProvider';
import { CommentsSection } from '../components/app/CommentsSection';

type SortMode = 'newest' | 'popular' | 'discussed';

export function ExplorePage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [allTags, setAllTags] = useState<{ tag: string; count: number }[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('newest');
    const [loading, setLoading] = useState(true);
    const [commentCounts, setCommentCounts] = useState<Map<string, number>>(new Map());
    const [topAuthors, setTopAuthors] = useState<{ id: string; username: string; full_name: string | null; avatar_url: string | null; post_count: number }[]>([]);
    const [kudosGiven, setKudosGiven] = useState<Set<string>>(new Set());
    const [kudosLoading, setKudosLoading] = useState<Set<string>>(new Set());
    const [openComments, setOpenComments] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterAndSortPosts();
    }, [searchQuery, selectedTag, posts, sortMode, commentCounts]);

    async function fetchData() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    author:profiles(username, full_name, avatar_url)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            const postsData = data || [];
            setPosts(postsData);

            // Load user kudos
            if (user && postsData.length > 0) {
                const kudos = await getUserKudos(user.id, postsData.map(p => p.id));
                setKudosGiven(kudos);
            }

            // Comment counts
            if (postsData.length > 0) {
                const counts = await getCommentCounts(postsData.map(p => p.id));
                setCommentCounts(counts);
            }

            // Extract tags with counts
            const tagMap = new Map<string, number>();
            postsData.forEach(p => (p.tags || []).forEach((tag: string) => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            }));
            const sortedTags = Array.from(tagMap.entries())
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count);
            setAllTags(sortedTags);

            // Top authors (by post count)
            const authorMap = new Map<string, { id: string; username: string; full_name: string | null; avatar_url: string | null; post_count: number }>();
            postsData.forEach(p => {
                if (!p.author_id || !p.author) return;
                const existing = authorMap.get(p.author_id);
                if (existing) {
                    existing.post_count++;
                } else {
                    authorMap.set(p.author_id, {
                        id: p.author_id,
                        username: p.author.username,
                        full_name: p.author.full_name,
                        avatar_url: p.author.avatar_url,
                        post_count: 1,
                    });
                }
            });
            setTopAuthors(Array.from(authorMap.values()).sort((a, b) => b.post_count - a.post_count).slice(0, 5));
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }

    function filterAndSortPosts() {
        let result = [...posts];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(q) ||
                (post.content && post.content.toLowerCase().includes(q)) ||
                (post.author?.full_name && post.author.full_name.toLowerCase().includes(q)) ||
                (post.author?.username && post.author.username.toLowerCase().includes(q))
            );
        }

        if (selectedTag) {
            result = result.filter(post => post.tags && post.tags.includes(selectedTag));
        }

        // Sort
        switch (sortMode) {
            case 'popular':
                result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
                break;
            case 'discussed':
                result.sort((a, b) => (commentCounts.get(b.id) || 0) - (commentCounts.get(a.id) || 0));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }

        setFilteredPosts(result);
    }

    const sortOptions: { key: SortMode; labelKey: string }[] = [
        { key: 'newest', labelKey: 'explore.sortNewest' },
        { key: 'popular', labelKey: 'explore.sortPopular' },
        { key: 'discussed', labelKey: 'explore.sortDiscussed' },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="mb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <TrendingUp className="w-7 h-7 text-blue-600" />
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{t('explore.title')}</h1>
                        </div>
                        <p className="text-slate-500 dark:text-zinc-400">{t('explore.subtitle')}</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('explore.search')}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 shadow-sm dark:shadow-none transition-all text-slate-900 dark:text-zinc-50 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Sort Tabs */}
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-slate-400" />
                        {sortOptions.map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setSortMode(opt.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortMode === opt.key
                                    ? 'bg-blue-600 text-white shadow-md dark:shadow-none shadow-blue-600/20'
                                    : 'bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {t(opt.labelKey)}
                            </button>
                        ))}
                    </div>

                    {/* Tag Filters */}
                    {allTags.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t('explore.filterByTag')}:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === null
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {t('dashboard.all')}
                                </button>
                                {allTags.map(({ tag, count }) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        #{tag} <span className="text-xs opacity-60">({count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-16 text-slate-400">
                                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                {t('common.loading')}
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-[#111111] dark:border-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 dark:text-zinc-300 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-zinc-400 font-medium mb-1">{t('explore.noResults')}</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-zinc-400">
                                    {searchQuery ? `"${searchQuery}" ${t('explore.noResultsFor')}` : t('explore.noPosts')}
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-slate-400">{filteredPosts.length} {t('explore.resultsFound')}</p>
                                {filteredPosts.map(post => (
                                    <Card key={post.id} className="p-6 border-slate-100 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all">
                                        <Link to={`/user/${post.author_id}`} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                                            <img
                                                src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'User'}`}
                                                alt={post.author?.full_name || 'User'}
                                                className="w-9 h-9 rounded-full bg-slate-100 object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-zinc-50 hover:text-blue-600 transition-colors">{post.author?.full_name || post.author?.username || 'Anonymous'}</p>
                                                <p className="text-xs text-slate-400">@{post.author?.username} • {new Date(post.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </Link>

                                        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-2">
                                            <Link to={`/post/${post.id}`} className="hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </Link>
                                        </h2>
                                        {(post.excerpt || post.content) && (
                                            <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed line-clamp-2 mb-3">
                                                {post.excerpt || post.content}
                                            </p>
                                        )}

                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="bg-slate-100 dark:bg-[#222222] text-slate-600 dark:text-zinc-300 text-xs px-2 py-1 rounded-md font-medium">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-5 pt-3 border-t border-slate-50 dark:border-white/10 text-sm text-slate-400">
                                            <button
                                                onClick={async () => {
                                                    if (!user || kudosLoading.has(post.id)) return;
                                                    setKudosLoading(prev => new Set(prev).add(post.id));
                                                    try {
                                                        const { given, newCount } = await toggleKudos(post.id, user.id);
                                                        setKudosGiven(prev => {
                                                            const next = new Set(prev);
                                                            if (given) next.add(post.id); else next.delete(post.id);
                                                            return next;
                                                        });
                                                        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: newCount } : p));
                                                    } catch (e) { console.error(e); }
                                                    setKudosLoading(prev => { const n = new Set(prev); n.delete(post.id); return n; });
                                                }}
                                                className={`flex items-center gap-1.5 transition-colors ${kudosGiven.has(post.id) ? 'text-blue-600' : 'hover:text-blue-500'}`}
                                            >
                                                <ThumbsUp className={`w-4 h-4 ${kudosGiven.has(post.id) ? 'fill-blue-100' : ''}`} /> {post.likes_count || 0}
                                            </button>
                                            <button
                                                onClick={() => setOpenComments(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(post.id)) next.delete(post.id); else next.add(post.id);
                                                    return next;
                                                })}
                                                className={`flex items-center gap-1.5 transition-colors ${openComments.has(post.id) ? 'text-blue-600' : 'hover:text-blue-500'}`}
                                            >
                                                <MessageSquare className={`w-4 h-4 ${openComments.has(post.id) ? 'fill-blue-100' : ''}`} /> {commentCounts.get(post.id) || 0}
                                            </button>
                                        </div>

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
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Top Authors */}
                    {topAuthors.length > 0 && (
                        <Card className="p-5 border-slate-100 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <Crown className="w-5 h-5 text-amber-500" />
                                <h3 className="font-bold text-slate-900 dark:text-zinc-50">{t('explore.topAuthors')}</h3>
                            </div>
                            <div className="space-y-3">
                                {topAuthors.map((author, i) => (
                                    <Link key={author.id} to={`/user/${author.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                                        <img
                                            src={author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
                                            alt=""
                                            className="w-9 h-9 rounded-full bg-slate-100 object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-50 truncate">{author.full_name || author.username}</p>
                                            <p className="text-xs text-slate-400">@{author.username} • {author.post_count} {t('explore.posts')}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Trending Tags */}
                    {allTags.length > 0 && (
                        <Card className="p-5 border-slate-100 dark:border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-900 dark:text-zinc-50">{t('explore.trendingTags')}</h3>
                            </div>
                            <div className="space-y-2">
                                {allTags.slice(0, 8).map(({ tag, count }) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedTag === tag
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-zinc-300'
                                            }`}
                                    >
                                        <span className="font-medium">#{tag}</span>
                                        <span className="text-xs text-slate-400">{count} {t('explore.posts')}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
