import { useState, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Image, Hash, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthProvider';

export function CreatePost() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            addToast('Sarlavha va matn bo\'lishi shart', 'error');
            return;
        }

        if (!user) {
            addToast('Iltimos, avval tizimga kiring', 'error');
            navigate('/login');
            return;
        }

        setIsPublishing(true);
        try {
            // 1. Ensure Profile Exists (since we don't have a trigger yet)
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            if (!profile) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        username: user.email?.split('@')[0] || 'user',
                        full_name: user.email?.split('@')[0],
                        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                    });
                if (profileError) throw profileError;
            }

            // 2. Create Post
            const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
            const postData: Record<string, unknown> = {
                author_id: user.id,
                title,
                content,
                excerpt: content.substring(0, 150),
            };
            if (parsedTags.length > 0) {
                postData.tags = parsedTags;
            }

            const { error } = await supabase
                .from('posts')
                .insert(postData);

            if (error) throw error;

            addToast('Note muvaffaqiyatli chop etildi!', 'success');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Error creating post:', error);
            addToast(error.message || 'Xatolik yuz berdi', 'error');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" className="text-slate-500">Qoralama saqlash</Button>
                    <Button
                        onClick={handlePublish}
                        isLoading={isPublishing}
                        className="shadow-lg shadow-blue-500/20"
                    >
                        Chop etish
                    </Button>
                </div>
            </div>

            {/* Editor Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 min-h-[70vh]">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Sarlavha..."
                    className="w-full text-4xl md:text-5xl font-black placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 bg-transparent text-slate-900 mb-8"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />

                {/* Toolbar (Simple) */}
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Rasm qo'shish">
                        <Image className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg w-full max-w-xs transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Teglar (vergul bilan ajrating)"
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <textarea
                    ref={textareaRef}
                    placeholder="Fikrlaringizni yozing..."
                    className="w-full resize-none text-lg text-slate-700 placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 bg-transparent leading-relaxed min-h-[300px]"
                    value={content}
                    onChange={handleInput}
                />
            </div>
        </div>
    );
}
