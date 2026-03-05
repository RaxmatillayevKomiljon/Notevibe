import { faqs } from '../../data/content';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 text-center mb-12">Ko'p so'raladigan savollar</h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-slate-900 dark:text-zinc-50">{faq.q}</span>
                                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>

                            <div className={cn(
                                "px-6 pb-6 text-slate-600 dark:text-zinc-300 leading-relaxed",
                                openIndex === idx ? "block" : "hidden"
                            )}>
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
