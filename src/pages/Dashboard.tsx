import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Flame, MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';

const MOCK_POSTS = [
    {
        id: 1,
        author: { name: "Aziza Karimova", handle: "@aziza_k", avatar: "https://api.dicebear.com/7.x/avataaHs/svg?seed=Aziza" },
        time: "2 soat oldin",
        title: "Dasturlashni o'rganishdagi eng katta xato",
        content: "Ko'pchilik dasturlashni boshlaganda birdaniga sintaksis yodlashga tushadi. Aslida esa mantiqiy fikrlashni rivojlantirish muhimroq. Men o'zim 6 oy vaqtimni behuda sarflaganman...",
        tags: ["Dasturlash", "Tajriba", "Maslahat"],
        likes: 45,
        comments: 12,
        readTime: "4 min o'qish"
    },
    {
        id: 2,
        author: { name: "Javohir N.", handle: "@javohir_dev", avatar: "https://api.dicebear.com/7.x/avataaHs/svg?seed=Javohir" },
        time: "5 soat oldin",
        title: "React 19 da nimalar yangi? Qisqacha sharh",
        content: "React jamoasi yangi versiyani e'lon qildi va bu safar ular rostdan ham katta o'zgarishlar kiritishdi. Server Components endi standart bo'lishi kutilmoqda...",
        tags: ["React", "Frontend", "News"],
        likes: 128,
        comments: 34,
        readTime: "6 min o'qish",
        hasImage: true
    }
];

export function Dashboard() {
    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
                {/* Header & Search */}
                <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur z-10 py-2">
                    <h1 className="text-2xl font-bold text-slate-900">Mening lentam</h1>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                        />
                    </div>
                </div>

                {/* Categories / Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {["Barchasi", "Dasturlash", "Dizayn", "Shaxsiy Rivojlanish", "Startaplar"].map((cat, i) => (
                        <button
                            key={i}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0
                                    ? "bg-slate-900 text-white"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts */}
                <div className="space-y-6">
                    {MOCK_POSTS.map(post => (
                        <Card key={post.id} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-slate-100" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{post.author.name}</h3>
                                        <p className="text-xs text-slate-500">{post.author.handle} • {post.time}</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 leading-relaxed line-clamp-3">
                                    {post.content}
                                </p>
                            </div>

                            {post.tags.map(tag => (
                                <span key={tag} className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md mr-2 mb-4 font-medium">
                                    #{tag}
                                </span>
                            ))}

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex gap-6">
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors text-sm group">
                                        <Heart className="w-5 h-5 group-hover:fill-pink-500 transition-colors" />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors text-sm">
                                        <MessageSquare className="w-5 h-5" />
                                        <span>{post.comments}</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                    <span>{post.readTime}</span>
                                    <button className="hover:text-slate-800">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Sidebar (Trending & Recommendations) */}
            <div className="hidden lg:block space-y-6">
                {/* Trending Topics */}
                <Card className="p-5 border-slate-100 shadow-sm sticky top-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <h3>Trenddagi mavzular</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { topic: "Sun'iy Intellekt", posts: "2.4k post" },
                            { topic: "JavaScript", posts: "1.8k post" },
                            { topic: "Freelance", posts: "956 post" },
                            { topic: "Kitobxonlik", posts: "840 post" }
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item.topic}</p>
                                    <p className="text-xs text-slate-400">{item.posts}</p>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Suggested Users */}
                <Card className="p-5 border-slate-100 shadow-sm sticky top-64">
                    <h3 className="font-bold text-slate-900 mb-4">Tavsiya etilgan avtorlar</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <img src={`https://api.dicebear.com/7.x/avataaHs/svg?seed=${i + 10}`} alt="User" className="w-9 h-9 rounded-full bg-slate-100" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">User {i}</p>
                                    <p className="text-xs text-slate-500 truncate">Fullstack Dev</p>
                                </div>
                                <Button size="sm" variant="outline" className="h-8 px-3 text-xs">A'zo bo'lish</Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
