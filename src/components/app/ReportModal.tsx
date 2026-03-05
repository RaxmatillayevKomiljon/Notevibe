import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { reportPost, reportComment, ReportReason } from '../../lib/reports';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from '../../lib/i18n';

interface Props {
    type: 'post' | 'comment';
    targetId: string;
    onClose: () => void;
    onReported?: () => void;
}

const REASONS: ReportReason[] = ['spam', 'inappropriate', 'harassment', 'other'];

export function ReportModal({ type, targetId, onClose, onReported }: Props) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [reason, setReason] = useState<ReportReason | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit() {
        if (!user || !reason) return;
        setLoading(true);

        let ok = false;
        if (type === 'post') {
            ok = await reportPost(user.id, targetId, reason, description || undefined);
        } else {
            ok = await reportComment(user.id, targetId, reason, description || undefined);
        }

        setLoading(false);
        if (ok) {
            setDone(true);
            onReported?.();
            setTimeout(onClose, 1500);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#111111] dark:border-white/5 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {done ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Flag className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-zinc-50">{t('report.sent')}</p>
                        <p className="text-sm text-slate-400 mt-1">{t('report.sentDesc')}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Flag className="w-5 h-5 text-red-500" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">{t('report.title')}</h3>
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">{t('report.selectReason')}</p>

                        <div className="space-y-2 mb-4">
                            {REASONS.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${reason === r
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-2 border-red-200 dark:border-red-800'
                                            : 'bg-slate-50 dark:bg-[#222222] text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-slate-600 border-2 border-transparent'
                                        }`}
                                >
                                    {t(`report.reason.${r}`)}
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder={t('report.descPlaceholder')}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-white/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 resize-none h-20 text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 mb-4"
                        />

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={onClose} className="flex-1">{t('profile.cancel')}</Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!reason || loading}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                {loading ? '...' : t('report.submit')}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
