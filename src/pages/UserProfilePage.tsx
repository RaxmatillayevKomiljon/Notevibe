import { Button } from '../components/ui/Button';
import { MapPin, Calendar, Link as LinkIcon, ThumbsUp, MessageSquare, UserPlus, UserCheck, ArrowLeft, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase } from '../lib/supabase';
import { Post, Profile as ProfileType } from '../lib/types';
import { Card } from '../components/ui/Card';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFollowCounts, isFollowing, toggleFollow, getFollowers, getFollowingUsers } from '../lib/follows';

type FollowUser = { id: string; username: string; full_name: string | null; avatar_url: string | null };

export function UserProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
    const [following, setFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [totalKudos, setTotalKudos] = useState(0);

    // Follow list modal
    const [showFollowList, setShowFollowList] = useState<'followers' | 'following' | null>(null);
    const [followList, setFollowList] = useState<FollowUser[]>([]);
    const [followListLoading, setFollowListLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('Notelar');

    const isOwnProfile = currentUser?.id === userId;

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    async function fetchUserData() {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (!profileData) {
                setProfile(null);
                setLoading(false);
                return;
            }
            setProfile(profileData);

            // 2. Fetch Posts
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .eq('author_id', userId)
                .order('created_at', { ascending: false });

            const userPosts = postsData || [];
            setPosts(userPosts);

            // 3. Calculate total kudos
            const kudos = userPosts.reduce((sum, p) => sum + (p.likes_count || 0), 0);
            setTotalKudos(kudos);

            // 4. Follow counts
            const counts = await getFollowCounts(userId!);
            setFollowCounts(counts);

            // 5. Check if current user follows this user
            if (currentUser && !isOwnProfile) {
                const isF = await isFollowing(currentUser.id, userId!);
                setFollowing(isF);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleFollow() {
        if (!currentUser || !userId || followLoading) return;
        setFollowLoading(true);
        try {
            const nowFollowing = await toggleFollow(currentUser.id, userId);
            setFollowing(nowFollowing);
            setFollowCounts(prev => ({
                ...prev,
                followers: nowFollowing ? prev.followers + 1 : prev.followers - 1
            }));
        } catch (e) {
            console.error('Follow error:', e);
        } finally {
            setFollowLoading(false);
        }
    }

    async function openFollowList(type: 'followers' | 'following') {
        setShowFollowList(type);
        setFollowListLoading(true);
        try {
            const list = type === 'followers'
                ? await getFollowers(userId!)
                : await getFollowingUsers(userId!);
            setFollowList(list);
        } catch (e) {
            console.error('Error loading follow list:', e);
        } finally {
            setFollowListLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="p-10 text-center text-slate-500 dark:text-zinc-400">
                Yuklanmoqda...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-10 text-center">
                <p className="text-slate-500 dark:text-zinc-400 mb-4">Foydalanuvchi topilmadi</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Orqaga
                </Button>
            </div>
        );
    }

    return (
        <div>
            {/* Follow List Modal */}
            {showFollowList && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#111111] dark:border-white/5 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10">
                            <h3 className="font-bold text-slate-900 dark:text-zinc-50">
                                {showFollowList === 'followers' ? 'Obunachilari' : 'Obunalari'}
                            </h3>
                            <button
                                onClick={() => setShowFollowList(null)}
                                className="text-slate-400 hover:text-slate-600 dark:text-zinc-300 dark:hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                            {followListLoading ? (
                                <p className="text-center text-slate-400 py-8">Yuklanmoqda...</p>
                            ) : followList.length === 0 ? (
                                <p className="text-center text-slate-400 py-8">
                                    {showFollowList === 'followers' ? 'Obunachilari yo\'q' : 'Hech kimga obuna bo\'lmagan'}
                                </p>
                            ) : (
                                followList.map(u => (
                                    <Link
                                        key={u.id}
                                        to={`/user/${u.id}`}
                                        onClick={() => setShowFollowList(null)}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <img
                                            src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                                            alt={u.username}
                                            className="w-10 h-10 rounded-full bg-slate-100"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-zinc-50">
                                                {u.full_name || u.username}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">@{u.username}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:text-zinc-200 dark:hover:text-white mb-4 text-sm font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Orqaga
            </button>

            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl mb-16 relative">
                <div className="absolute -bottom-12 left-4 md:left-10 flex items-end">
                    <div className="p-1.5 bg-white dark:bg-[#111111] dark:border-white/5 rounded-2xl">
                        <img
                            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-slate-100 object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-2 md:px-4 mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-1">
                        {profile.full_name || profile.username || 'Foydalanuvchi'}
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mb-4">
                        @{profile.username || 'user'}
                    </p>

                    <p className="text-slate-600 dark:text-zinc-300 max-w-xl leading-relaxed mb-4">
                        {profile.bio || "Bio qo'shilmagan."}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Toshkent, O'zbekiston
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(profile.created_at).getFullYear()} yildan beri a'zo
                        </div>
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:underline">
                                <LinkIcon className="w-4 h-4" />
                                {(() => { try { return new URL(profile.website).hostname; } catch { return profile.website; } })()}
                            </a>
                        )}
                    </div>
                </div>

                {/* Follow/Own Profile Actions */}
                <div className="flex gap-3">
                    {isOwnProfile ? (
                        <Button variant="outline" onClick={() => navigate('/profile')}>
                            Profilni tahrirlash
                        </Button>
                    ) : currentUser ? (
                        <Button
                            variant={following ? 'outline' : 'primary'}
                            onClick={handleToggleFollow}
                            disabled={followLoading}
                            className={following ? 'border-blue-600 text-blue-600 hover:bg-red-50 hover:text-red-600 hover:border-red-600' : ''}
                        >
                            {followLoading ? '...' : following ? (
                                <><UserCheck className="w-4 h-4 mr-2" />Obuna</>
                            ) : (
                                <><UserPlus className="w-4 h-4 mr-2" />Obuna bo'lish</>
                            )}
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-8 max-w-2xl">
                <div className="text-center p-4 bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none">
                    <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{posts.length}</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Note</p>
                </div>
                <button
                    onClick={() => openFollowList('followers')}
                    className="text-center p-4 bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
                >
                    <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{followCounts.followers}</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Obunachi</p>
                </button>
                <button
                    onClick={() => openFollowList('following')}
                    className="text-center p-4 bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
                >
                    <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{followCounts.following}</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Obuna</p>
                </button>
                <div className="text-center p-4 bg-white dark:bg-[#111111] dark:border-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none">
                    <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{totalKudos}</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Kudos</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/10 mb-6">
                {['Notelar', 'Haqida'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                            ? "text-blue-600"
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:text-zinc-50 dark:hover:text-white"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
                {activeTab === 'Notelar' && (
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 dark:bg-[#111111] dark:border-white/5/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                                <p className="text-slate-400">Hozircha notelar topilmadi</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <Card key={post.id} className="p-6">
                                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-zinc-50">{post.title}</h3>
                                    <p className="text-slate-600 dark:text-zinc-300 line-clamp-2 mb-4">{post.content}</p>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {post.likes_count}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> 0</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
                {activeTab === 'Haqida' && (
                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-4">Bio</h3>
                        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed mb-6">
                            {profile.bio || "Bio qo'shilmagan."}
                        </p>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-4">Ma'lumotlar</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-600 dark:text-zinc-300">{new Date(profile.created_at).getFullYear()} yildan beri a'zo</span>
                            </div>
                            {profile.website && (
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="w-5 h-5 text-slate-400" />
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {profile.website}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-600 dark:text-zinc-300">Toshkent, O'zbekiston</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-600 dark:text-zinc-300">{followCounts.followers} obunachi · {followCounts.following} obuna · {totalKudos} kudos</span>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
