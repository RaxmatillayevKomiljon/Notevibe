import { awards } from '../../data/content';
import { Card } from '../ui/Card';
import { Trophy, Star } from 'lucide-react';

export function Awards() {
    return (
        <section id="awards" className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="container mx-auto px-4 relative">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100/50 text-yellow-700 text-xs font-bold mb-4 border border-yellow-200">
                            <Trophy className="w-3 h-3" />
                            <span>Oylik g'oliblar</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-50">Eng yaxshilar taqdirlanadi</h2>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-300 max-w-md text-sm md:text-base">
                        Biz har oy eng ko'p o'qilgan va eng foydali postlar mualliflarini aniqlaymiz va sovg'alar beramiz.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {awards.map((award, idx) => (
                        <Card key={idx} className="p-6 border-slate-200/60 flex items-center gap-4 bg-white/80 backdrop-blur">
                            <div className="relative">
                                <img src={award.avatar} alt={award.user} className="w-14 h-14 rounded-full bg-slate-100" />
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full border-2 border-white">
                                    <Star className="w-3 h-3 fill-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">{award.month} oyida</p>
                                <h3 className="font-bold text-slate-900 dark:text-zinc-50">{award.title}</h3>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm">{award.user}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
