import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { addBook } from '../../lib/library';
import { useAuth } from '../auth/AuthProvider';

interface Props {
    libraryId: string;
    open: boolean;
    onClose: () => void;
    onAdded: () => void;
}

export function AddBookModal({ libraryId, open, onClose, onAdded }: Props) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '', author: '', genre: '', language: 'uz',
        description: '', cover_url: '', total_count: 1,
    });
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !form.title.trim() || !form.author.trim()) return;

        setLoading(true);
        const result = await addBook({
            library_id: libraryId,
            title: form.title.trim(),
            author: form.author.trim(),
            genre: form.genre.trim() || undefined,
            language: form.language || undefined,
            description: form.description.trim() || undefined,
            cover_url: form.cover_url.trim() || undefined,
            total_count: form.total_count,
            created_by: user.id,
        });

        if (result) {
            onAdded();
            onClose();
            setForm({ title: '', author: '', genre: '', language: 'uz', description: '', cover_url: '', total_count: 1 });
        }
        setLoading(false);
    };

    const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Kitob qo'shish</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Nomi *</label>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Kitob nomi" className={inputClass} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Muallif *</label>
                        <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Muallif ismi" className={inputClass} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Janr</label>
                            <input value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="Roman, Fan..." className={inputClass} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Til</label>
                            <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputClass}>
                                <option value="uz">O'zbek</option>
                                <option value="ru">Rus</option>
                                <option value="en">Ingliz</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Tavsif</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Kitob haqida qisqacha..." rows={3} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Muqova URL</label>
                            <input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." className={inputClass} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Nusxalar soni</label>
                            <input type="number" min={1} value={form.total_count} onChange={e => setForm(f => ({ ...f, total_count: parseInt(e.target.value) || 1 }))} className={inputClass} />
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl p-3">
                        <p className="text-xs text-blue-600 dark:text-blue-400">ℹ️ Kitob admin tomonidan tasdiqlanganidan keyin boshqa foydalanuvchilarga ko'rinadi.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.title || !form.author}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {loading ? "Yuborilmoqda..." : "Kitob qo'shish"}
                    </button>
                </form>
            </div>
        </div>
    );
}
