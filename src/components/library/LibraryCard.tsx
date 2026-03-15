import { Link } from 'react-router-dom';
import { MapPin, BookOpen } from 'lucide-react';
import type { Library } from '../../lib/types';

interface Props { library: Library }

export function LibraryCard({ library }: Props) {
    return (
        <Link to={`/library/${library.id}`}>
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:shadow-lg dark:hover:border-white/20 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                    {library.logo_url ? (
                        <img src={library.logo_url} alt={library.name} className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-white/5 shrink-0" />
                    ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-zinc-50 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {library.name}
                        </h3>
                        {library.description && (
                            <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">{library.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-zinc-500">
                            {library.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> {library.location}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" /> {library.book_count || 0} ta kitob
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
