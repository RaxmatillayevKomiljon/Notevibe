import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BadgeCheck, Flame, MessageSquare, Repeat, Heart } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100 rounded-[100%] blur-3xl -z-10 opacity-60" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left animate-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-6">
                        <BadgeCheck className="w-4 h-4" />
                        <span>Yopiq hamjamiyat • Beta</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight">
                        Har kuni yozing. <br className="hidden md:block" />
                        <span className="gradient-text">Ilhom ulashing.</span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        Notevibe — bu o'quvchilar uchun fikrlarini erkin ifoda etish, yozish ko'nikmalarini oshirish va bir-birini qo'llab-quvvatlash makoni.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link to="/login">
                            <Button size="lg" className="w-full sm:w-auto shadow-blue-500/25">Hozir boshlash</Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="w-full sm:w-auto shadow-sm"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Batafsil
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://api.dicebear.com/7.x/avataaHs/svg?seed=${i * 123}`} alt="User" className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                            ))}
                        </div>
                        <p>1,200+ o'quvchi qo'shildi</p>
                    </div>
                </div>

                {/* Right Mockup */}
                <div className="relative animate-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl transform rotate-3 scale-95" />

                    <Card className="relative p-6 max-w-md mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 border-slate-200/60 shadow-2xl">
                        {/* Mock Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <img src="https://api.dicebear.com/7.x/avataaHs/svg?seed=Felix" alt="Author" className="w-10 h-10 rounded-full bg-slate-100" />
                            <div>
                                <h4 className="font-bold text-slate-900">Asilbek T.</h4>
                                <p className="text-xs text-slate-500">2 soat oldin • 5 min o'qish</p>
                            </div>
                            <div className="ml-auto text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full text-xs font-bold">
                                <Flame className="w-3 h-3" />
                                12 kun streak
                            </div>
                        </div>

                        {/* Mock Content */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Nega men har kuni ertalab kitob o'qiyman? 📚</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Avvallari ertalab turiboq telefonimga yopishardim. Lekin o'tgan oydan boshlab, har tong 20 daqiqa kitob o'qishni odat qildim. Natijalar hayratlanarli: diqqatim oshdi, xotiram kuchaydi...
                            </p>
                            <div className="h-32 bg-slate-100 rounded-xl overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000" alt="Book" className="w-full h-full object-cover opacity-90" />
                            </div>
                        </div>

                        {/* Mock Actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 text-pink-500 text-sm font-semibold bg-pink-50 px-3 py-1.5 rounded-full hover:bg-pink-100 transition">
                                    <Heart className="w-4 h-4 fill-pink-500" />
                                    24 Kudos
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-full hover:bg-slate-100 transition">
                                    <MessageSquare className="w-4 h-4" />
                                    8
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <Repeat className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>

                    {/* Floating Element */}
                    <div className="absolute -right-4 top-10 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 animate-bounce duration-[3000ms]">
                        <span className="text-2xl">🔥</span>
                    </div>
                    <div className="absolute -left-4 bottom-20 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 animate-bounce duration-[4000ms]">
                        <span className="text-2xl">✍️</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
