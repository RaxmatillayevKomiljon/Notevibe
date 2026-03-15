import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Plus, MapPin, Phone, BookOpen, Filter } from 'lucide-react';
import { getLibrary, getBooks } from '../lib/library';
import { BookCard } from '../components/library/BookCard';
import { AddBookModal } from '../components/library/AddBookModal';
import { useAuth } from '../components/auth/AuthProvider';
import type { Library, Book } from '../lib/types';

export function LibraryPage() {
    const { libraryId } = useParams<{ libraryId: string }>();
    const { user } = useAuth();
    const [library, setLibrary] = useState<Library | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState<string | null>(null);
    const [langFilter, setLangFilter] = useState<string | null>(null);
    const [showAddBook, setShowAddBook] = useState(false);

    useEffect(() => {
        if (libraryId) loadData();
    }, [libraryId]);

    async function loadData() {
        setLoading(true);
        const [lib, bks] = await Promise.all([
            getLibrary(libraryId!),
            getBooks(libraryId!, false),
        ]);
        setLibrary(lib);
        setBooks(bks);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!library) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 dark:text-zinc-400 mb-4">Kutubxona topilmadi</p>
                <Link to="/libraries" className="text-blue-600 hover:underline font-medium">&larr; Ortga</Link>
            </div>
        );
    }

    // Get unique genres & languages for filters
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))] as string[];
    const languages = [...new Set(books.map(b => b.language).filter(Boolean))] as string[];

    const langLabels: Record<string, string> = { uz: "O'zbek", ru: "Rus", en: "Ingliz" };

    const filtered = books.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase());
        const matchGenre = !genreFilter || b.genre === genreFilter;
        const matchLang = !langFilter || b.language === langFilter;
        return matchSearch && matchGenre && matchLang;
    });

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back */}
            <Link to="/libraries" className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 transition-colors font-medium mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Kutubxonalar
            </Link>

            {/* Library Header */}
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-5">
                    {library.logo_url ? (
                        <img src={library.logo_url} alt={library.name} className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0" />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 mb-1">{library.name}</h1>
                        {library.description && (
                            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-3">{library.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-zinc-500">
                            {library.location && (
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {library.location}</span>
                            )}
                            {library.phone && (
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {library.phone}</span>
                            )}
                            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {library.book_count || 0} ta kitob</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls: Search, Filters, Add */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Kitob qidirish..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {user && (
                    <button
                        onClick={() => setShowAddBook(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Kitob qo'shish
                    </button>
                )}
            </div>

            {/* Genre & Language Filters */}
            {(genres.length > 0 || languages.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                    <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
                        <Filter className="w-3.5 h-3.5" /> Filtr:
                    </div>
                    {/* Genre pills */}
                    {genres.map(g => (
                        <button
                            key={g}
                            onClick={() => setGenreFilter(genreFilter === g ? null : g)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                genreFilter === g
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                    {/* Language pills */}
                    {languages.map(l => (
                        <button
                            key={l}
                            onClick={() => setLangFilter(langFilter === l ? null : l)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                langFilter === l
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            🌐 {langLabels[l] || l}
                        </button>
                    ))}
                </div>
            )}

            {/* Books Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl">
                    <BookOpen className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Kitoblar topilmadi</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map(book => (
                        <BookCard key={book.id} book={book} libraryId={library.id} />
                    ))}
                </div>
            )}

            <AddBookModal libraryId={library.id} open={showAddBook} onClose={() => setShowAddBook(false)} onAdded={loadData} />
        </div>
    );
}
