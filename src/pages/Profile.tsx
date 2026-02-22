import { Button } from '../components/ui/Button';
import { Settings, MapPin, Calendar, Link as LinkIcon, Edit3, Heart, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase } from '../lib/supabase';
import { Post, Profile as UserProfile } from '../lib/types';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const TABS = ['Maqolalar', 'Haqida', 'Saqlanganlar'];

export function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Maqolalar');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        username: '',
        bio: '',
        website: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfileData();
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            setEditForm({
                full_name: profile.full_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
                website: profile.website || ''
            });
            setAvatarFile(null);
        }
    }, [profile]);

    async function fetchProfileData() {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .maybeSingle();

            setProfile(profileData);

            // 2. Fetch User's Posts
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .eq('author_id', user?.id)
                .order('created_at', { ascending: false });

            setPosts(postsData || []);

        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files || event.target.files.length === 0) {
            setAvatarFile(null);
            return;
        }
        setAvatarFile(event.target.files[0]);
    }

    async function handleUpdateProfile() {
        try {
            setSaving(true);
            let avatarUrl = profile?.avatar_url;

            // 1. Upload Avatar if selected
            if (avatarFile) {
                setUploading(true);
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                avatarUrl = urlData.publicUrl;
                setUploading(false);
            }

            // 2. Update Profile Data
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editForm.full_name,
                    username: editForm.username,
                    bio: editForm.bio,
                    website: editForm.website,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user?.id);

            if (error) throw error;

            setProfile(prev => prev ? ({ ...prev, ...editForm, avatar_url: avatarUrl || prev.avatar_url }) : null);
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            if (error.message && error.message.includes('bucket not found')) {
                alert("Xatolik: 'avatars' nomli fayl saqlash joyi (bucket) topilmadi. Supabase dashboardida 'avatars' bucketini yarating va 'public' qilib belgilang.");
            } else {
                alert('Xatolik yuz berdi: ' + error.message);
            }
        } finally {
            setSaving(false);
            setUploading(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Yuklanmoqda...</div>;
    if (!user) return <div className="p-10 text-center">Iltimos, tizimga kiring.</div>;

    return (
        <div>
            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4">Profilni tahrirlash</h2>
                        <div className="space-y-4">
                            {/* Avatar Upload */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={avatarFile ? URL.createObjectURL(avatarFile) : (profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`)}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full bg-slate-100 object-cover border border-slate-200"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Profil rasmi</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ism-familiya</label>
                                <input
                                    type="text"
                                    value={editForm.full_name}
                                    onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Username (@)</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio (O'zingiz haqingizda)</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vebsayt</label>
                                <input
                                    type="url"
                                    value={editForm.website}
                                    onChange={e => setEditForm({ ...editForm, website: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Bekor qilish</Button>
                            <Button onClick={handleUpdateProfile} disabled={saving || uploading}>
                                {saving || uploading ? 'Saqlanmoqda...' : 'Saqlash'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-b-3xl -mx-4 md:-mx-6 -mt-6 mb-16 relative">
                <div className="absolute -bottom-12 left-4 md:left-10 flex items-end">
                    <div className="p-1.5 bg-white rounded-2xl">
                        <img
                            src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-slate-100 object-cover"
                        />
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-transparent backdrop-blur-sm">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Ulashish
                    </Button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-2 md:px-4 mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                        {profile?.full_name || user.user_metadata?.username || 'Foydalanuvchi'}
                    </h1>
                    <p className="text-slate-500 font-medium mb-4">
                        @{profile?.username || user.email?.split('@')[0]}
                    </p>

                    <p className="text-slate-600 max-w-xl leading-relaxed mb-4">
                        {profile?.bio || "Hozircha ma'lumot yo'q. Profilni tahrirlash orqali bio qo'shing."}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Toshkent, O'zbekiston
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.created_at).getFullYear()} yildan beri a'zo
                        </div>
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:underline">
                                <LinkIcon className="w-4 h-4" />
                                {new URL(profile.website).hostname}
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Sozlamalar
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Profilni tahrirlash
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
                <div className="text-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Maqola</p>
                </div>
                <div className="text-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Obunachi</p>
                </div>
                <div className="text-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Obuna</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                            ? "text-blue-600"
                            : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content based on Tab */}
            <div className="min-h-[200px]">
                {activeTab === 'Maqolalar' && (
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400">Hozircha maqolalar topilmadi</p>
                                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => window.location.href = '/create-post'}>Birinchi maqolani yozish</Button>
                            </div>
                        ) : (
                            posts.map(post => (
                                <Card key={post.id} className="p-6">
                                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                    <p className="text-slate-600 line-clamp-2 mb-4">{post.content}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes_count}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> 0</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
                {activeTab === 'Haqida' && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Bio</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            {profile?.bio || "Hozircha ma'lumot yo'q. Profilni tahrirlash orqali bio qo'shing."}
                        </p>

                        <h3 className="text-lg font-bold text-slate-900 mb-4">Ma'lumotlar</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-600">{new Date(user.created_at).getFullYear()} yildan beri a'zo</span>
                            </div>
                            {profile?.website && (
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="w-5 h-5 text-slate-400" />
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {profile.website}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-600">Toshkent, O'zbekiston</span>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Saqlanganlar' && (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 mb-2">Saqlangan maqolalar</p>
                        <p className="text-sm text-slate-400 mb-4">Saqlanganlar sahifasidan foydalaning</p>
                        <button
                            onClick={() => navigate('/bookmarks')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                        >
                            Saqlanganlar sahifasiga o'tish →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
