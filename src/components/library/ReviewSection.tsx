import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getReviews, addReview } from '../../lib/library';
import { useAuth } from '../auth/AuthProvider';
import type { BookReview } from '../../lib/types';

interface Props { bookId: string }

export function ReviewSection({ bookId }: Props) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [bookId]);

    async function loadReviews() {
        setLoading(true);
        const data = await getReviews(bookId);
        setReviews(data);
        setLoading(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || rating === 0) return;
        setSubmitting(true);
        const result = await addReview({ book_id: bookId, user_id: user.id, rating, comment: comment.trim() || undefined });
        if (result) {
            setRating(0);
            setComment('');
            loadReviews();
        }
        setSubmitting(false);
    };

    const alreadyReviewed = user ? reviews.some(r => r.user_id === user.id) : false;

    return (
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-4">Sharhlar ({reviews.length})</h3>

            {/* Add Review Form */}
            {user && !alreadyReviewed && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                    <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Bahoyingiz</p>
                    <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(s => (
                            <button
                                type="button"
                                key={s}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(s)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star className={`w-7 h-7 ${s <= (hoverRating || rating) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-zinc-600'}`} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Fikringizni yozing (ixtiyoriy)..."
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                    />
                    <button
                        type="submit"
                        disabled={rating === 0 || submitting}
                        className="mt-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {submitting ? "Yuborilmoqda..." : "Yuborish"}
                    </button>
                </form>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-zinc-500 text-center py-6">Hali sharhlar yo'q</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="flex gap-3">
                            <img
                                src={review.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.username || 'user'}`}
                                alt="" className="w-9 h-9 rounded-full bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-slate-900 dark:text-zinc-50">{review.user?.full_name || review.user?.username || 'User'}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-zinc-600'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                {review.comment && <p className="text-sm text-slate-600 dark:text-zinc-300">{review.comment}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
