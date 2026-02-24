import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Search, ThumbsUp, MessageSquare, TrendingUp, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { Link } from 'react-router-dom';

export function ExplorePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [searchQuery, selectedTag, posts]);

    async function fetchPosts() {
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

            // Extract unique tags
            const tags = postsData.flatMap(p => p.tags || []);
            const uniqueTags = Array.from(new Set(tags));
            setAllTags(uniqueTags);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }

    function filterPosts() {
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
            result = result.filter(post =>
                post.tags && post.tags.includes(selectedTag)
            );
        }

        setFilteredPosts(result);
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Kashf eting</h1>
                </div>
                <p className="text-slate-500">Yangi notelar, mualliflar va g'oyalarni toping</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Note, muallif yoki mavzu qidiring..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 shadow-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">Teglar bo'yicha filtrlash:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === null
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Barchasi
                        </button>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                #{tag}
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
                        Yuklanmoqda...
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium mb-1">Hech narsa topilmadi</p>
                        <p className="text-sm text-slate-400">
                            {searchQuery ? `"${searchQuery}" bo'yicha natija yo'q` : "Hozircha notelar yo'q"}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-400 mb-2">{filteredPosts.length} ta natija topildi</p>
                        {filteredPosts.map(post => (
                            <Card key={post.id} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <Link to={`/user/${post.author_id}`} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                                    <img
                                        src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'User'}`}
                                        alt={post.author?.full_name || 'User'}
                                        className="w-9 h-9 rounded-full bg-slate-100"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">{post.author?.full_name || post.author?.username || 'Anonymous'}</p>
                                        <p className="text-xs text-slate-400">@{post.author?.username} • {new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                </Link>

                                <h2 className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                                    {post.title}
                                </h2>
                                {post.excerpt && (
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                                )}
                                {!post.excerpt && post.content && (
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
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
