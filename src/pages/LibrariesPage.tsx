import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import { getLibraries } from '../lib/library';
import { LibraryCard } from '../components/library/LibraryCard';
import { CreateLibraryModal } from '../components/library/CreateLibraryModal';
import { useAuth } from '../components/auth/AuthProvider';
import type { Library } from '../lib/types';

export function LibrariesPage() {
    const { isAdmin } = useAuth();
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => { loadLibraries(); }, []);

    async function loadLibraries() {
        setLoading(true);
        const data = await getLibraries();
        setLibraries(data);
        setLoading(false);
    }

    const filtered = libraries.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        (l.location || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Kutubxonalar</h1>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Kitoblar dunyosini kashf eting</p>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Yangi kutubxona
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Kutubxona qidirish..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-slate-900 dark:text-zinc-50 placeholder:text-slate-400"
                />
            </div>

            {/* Libraries Grid */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl">
                    <BookOpen className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Kutubxonalar topilmadi</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {filtered.map(lib => (
                        <LibraryCard key={lib.id} library={lib} />
                    ))}
                </div>
            )}

            <CreateLibraryModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={loadLibraries} />
        </div>
    );
}
