import { PenTool, Flame, Trophy } from 'lucide-react';

export function Steps() {
    const steps = [
        {
            icon: PenTool,
            title: "1. Yozing",
            desc: "Har kuni kamida 10 daqiqa vaqt ajratib, o'z fikrlaringizni yozing."
        },
        {
            icon: Flame,
            title: "2. Streak quring",
            desc: "Yozishni tashlamang. Ketma-ket kunlar sonini ko'paytiring."
        },
        {
            icon: Trophy,
            title: "3. Yuting",
            desc: "Eng faol yozuvchilar har oy maxsus sovg'alar va sertifikatlar olishadi."
        }
    ];

    return (
        <section id="how" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Qanday ishlaydi?</h2>

                <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center group relative">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{step.desc}</p>

                            {/* Connector Line (Desktop only) */}
                            {idx !== steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-slate-100 -z-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
