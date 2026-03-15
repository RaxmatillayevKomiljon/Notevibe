import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Book } from '../../lib/types';

interface Props { book: Book; libraryId: string }

export function BookCard({ book, libraryId }: Props) {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
        approved: '',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    };

    return (
        <Link to={`/library/${libraryId}/book/${book.id}`}>
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:border-white/20 transition-all cursor-pointer group">
                {/* Cover */}
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 relative overflow-hidden">
                    {book.cover_url ? (
                        <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-slate-300 dark:text-zinc-600">{book.title.charAt(0)}</span>
                        </div>
                    )}
                    {book.status === 'pending' && (
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors.pending}`}>
                            Kutilmoqda
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h4 className="font-bold text-slate-900 dark:text-zinc-50 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {book.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 truncate">{book.author}</p>

                    <div className="flex items-center justify-between mt-3">
                        {book.avg_rating && book.avg_rating > 0 ? (
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{book.avg_rating}</span>
                            </div>
                        ) : (
                            <span className="text-[10px] text-slate-400">Yangi</span>
                        )}
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            book.available_count > 0
                                ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                            {book.available_count > 0 ? `${book.available_count} mavjud` : "Yo'q"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
