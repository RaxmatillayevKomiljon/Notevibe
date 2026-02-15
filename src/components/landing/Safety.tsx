import { ShieldCheck, MessageCircle, UserCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export function Safety() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Xavfsiz va do'stona muhit</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Notevibe faqat maktab o'quvchilari uchun. Bizda qat'iy moderatsiya va o'zaro hurmat qoidalari mavjud.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    { icon: ShieldCheck, text: "Barcha postlar tekshiriladi" },
                                    { icon: MessageCircle, text: "Haqoratli so'zlar avtomatik bloklanadi" },
                                    { icon: UserCheck, text: "Faqat tasdiqlangan profillar" }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                                        <div className="bg-slate-800 p-2 rounded-lg text-blue-400">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-slate-800 border-slate-700 p-6 text-white">
                                <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                                <div className="text-slate-400 text-sm">Moderatsiya tizimi ishlaydi</div>
                            </Card>
                            <Card className="bg-slate-800 border-slate-700 p-6 text-white">
                                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                                <div className="text-slate-400 text-sm">Xavfsiz kontent kafolati</div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
