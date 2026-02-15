import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function CTA() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] p-8 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                    {/* Background Decor */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">O'z hikoyangizni boshlashga tayyormisiz?</h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                            Bugun qo'shiling va minglab o'quvchilar bilan birga rivojlaning. <br />
                            Hech qanday to'lov yo'q. Faqat ilhom.
                        </p>

                        <Link to="/login">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-900/10 h-14 px-12 text-lg">
                                Hozir ro'yxatdan o'tish
                            </Button>
                        </Link>

                        <p className="mt-6 text-sm text-blue-200 opacity-80">
                            * Ro'yxatdan o'tish hozircha faqat taklifnoma bilan
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
