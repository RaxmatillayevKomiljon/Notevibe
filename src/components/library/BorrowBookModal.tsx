import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { requestBorrow } from '../../lib/library';
import { useAuth } from '../auth/AuthProvider';

interface Props {
    bookId: string;
    libraryId: string;
    bookTitle: string;
    open: boolean;
    onClose: () => void;
    onBorrowed: () => void;
}

export function BorrowBookModal({ bookId, libraryId, bookTitle, open, onClose, onBorrowed }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    if (!open) return null;

    const handleBorrow = async () => {
        if (!user) return;
        setLoading(true);
        const result = await requestBorrow(bookId, libraryId, user.id);
        if (result) {
            setDone(true);
            onBorrowed();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Kitob olish</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-5">
                    {done ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-2">So'rov yuborildi!</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">Admin sizning so'rovingizni ko'rib chiqadi.</p>
                            <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                                Yopish
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-4">
                                <p className="text-sm text-slate-700 dark:text-zinc-200">
                                    <strong>"{bookTitle}"</strong> kitobini olish so'rovini yubormoqchimisiz?
                                </p>
                                <p className="text-xs text-slate-400 mt-2">Admin so'rovni tasdiqlashi kerak.</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleBorrow}
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Yuborilmoqda..." : "So'rov yuborish"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
