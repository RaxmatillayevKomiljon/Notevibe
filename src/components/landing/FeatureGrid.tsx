import { features } from '../../data/content';
import { Card } from '../ui/Card';

export function FeatureGrid() {
    return (
        <section id="features" className="py-20 bg-slate-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Nega aynan Notevibe?</h2>
                    <p className="text-slate-600">Biz shunchaki blog emasmiz. Biz sizning shaxsiy rivojlanishingiz uchun mo'ljallangan ekotizimmiz.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <Card key={idx} className="p-6 border-none shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
