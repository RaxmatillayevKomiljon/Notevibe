import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen, Globe } from 'lucide-react';
import { getBook } from '../lib/library';
import { ReviewSection } from '../components/library/ReviewSection';
import { BorrowBookModal } from '../components/library/BorrowBookModal';
import { useAuth } from '../components/auth/AuthProvider';
import type { Book } from '../lib/types';

export function BookPage() {
    const { libraryId, bookId } = useParams<{ libraryId: string; bookId: string }>();
    const { user } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBorrow, setShowBorrow] = useState(false);

    useEffect(() => {
        if (bookId) loadBook();
    }, [bookId]);

    async function loadBook() {
        setLoading(true);
        const data = await getBook(bookId!);
        setBook(data);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 dark:text-zinc-400 mb-4">Kitob topilmadi</p>
                <Link to="/libraries" className="text-blue-600 hover:underline font-medium">&larr; Kutubxonalarga qaytish</Link>
            </div>
        );
    }

    const langLabels: Record<string, string> = { uz: "O'zbekcha", ru: "Ruscha", en: "Inglizcha" };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back */}
            <Link
                to={`/library/${libraryId}`}
                className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 transition-colors font-medium mb-4 text-sm"
            >
                <ArrowLeft className="w-4 h-4" /> Kutubxonaga qaytish
            </Link>

            {/* Book Details */}
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden mb-6">
                <div className="md:flex">
                    {/* Cover */}
                    <div className="md:w-64 shrink-0 aspect-[3/4] md:aspect-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 relative">
                        {book.cover_url ? (
                            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center min-h-[300px]">
                                <span className="text-6xl font-bold text-slate-300 dark:text-zinc-600">{book.title.charAt(0)}</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="p-6 md:p-8 flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-2">{book.title}</h1>
                        <p className="text-lg text-slate-500 dark:text-zinc-400 mb-4">{book.author}</p>

                        {/* Rating */}
                        {book.avg_rating != null && book.avg_rating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(book.avg_rating!) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-zinc-600'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{book.avg_rating}</span>
                                <span className="text-xs text-slate-400">({book.review_count} sharh)</span>
                            </div>
                        )}

                        {/* Meta tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {book.genre && (
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                                    {book.genre}
                                </span>
                            )}
                            {book.language && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-medium">
                                    <Globe className="w-3 h-3" /> {langLabels[book.language] || book.language}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {book.description && (
                            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 whitespace-pre-wrap">{book.description}</p>
                        )}

                        {/* Availability & Borrow */}
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-400" />
                                <span className={`text-sm font-medium ${book.available_count > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                    {book.available_count > 0 ? `${book.available_count} / ${book.total_count} mavjud` : "Hozirda mavjud emas"}
                                </span>
                            </div>

                            {user && book.available_count > 0 && (
                                <button
                                    onClick={() => setShowBorrow(true)}
                                    className="ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                                >
                                    Kitob olish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <ReviewSection bookId={book.id} />

            {/* Borrow Modal */}
            {libraryId && (
                <BorrowBookModal
                    bookId={book.id}
                    libraryId={libraryId}
                    bookTitle={book.title}
                    open={showBorrow}
                    onClose={() => setShowBorrow(false)}
                    onBorrowed={loadBook}
                />
            )}
        </div>
    );
}
