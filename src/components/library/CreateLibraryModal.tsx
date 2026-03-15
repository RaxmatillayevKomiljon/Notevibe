import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { createLibrary } from '../../lib/library';
import { useAuth } from '../auth/AuthProvider';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateLibraryModal({ open, onClose, onCreated }: Props) {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: '', description: '', location: '', phone: '', logo_url: '' });
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !form.name.trim()) return;

        setLoading(true);
        const result = await createLibrary({
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            location: form.location.trim() || undefined,
            phone: form.phone.trim() || undefined,
            logo_url: form.logo_url.trim() || undefined,
            created_by: user.id,
        });

        if (result) {
            onCreated();
            onClose();
            setForm({ name: '', description: '', location: '', phone: '', logo_url: '' });
        }
        setLoading(false);
    };

    const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">Yangi kutubxona</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Nomi *</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Kutubxona nomi" className={inputClass} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Tavsif</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Kutubxona haqida..." rows={3} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Manzil</label>
                            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Toshkent, ..." className={inputClass} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Telefon</label>
                            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 ..." className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Logo URL</label>
                        <input value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} placeholder="https://..." className={inputClass} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.name}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {loading ? "Yaratilmoqda..." : "Kutubxona yaratish"}
                    </button>
                </form>
            </div>
        </div>
    );
}
