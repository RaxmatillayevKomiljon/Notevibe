import { Button } from '../components/ui/Button';
import { Settings, MapPin, Calendar, Link as LinkIcon, Edit3 } from 'lucide-react';
import { useState } from 'react';

const TABS = ['Maqolalar', 'Haqida', 'Saqlanganlar'];

export function Profile() {
    const [activeTab, setActiveTab] = useState('Maqolalar');

    return (
        <div>
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-b-3xl -mx-4 md:-mx-6 -mt-6 mb-16 relative">
                <div className="absolute -bottom-12 left-4 md:left-10 flex items-end">
                    <div className="p-1.5 bg-white rounded-2xl">
                        <img
                            src="https://api.dicebear.com/7.x/avataaHs/svg?seed=Felix"
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-slate-100"
                        />
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-transparent backdrop-blur-sm">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Ulashish
                    </Button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-2 md:px-4 mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Asilbek T.</h1>
                    <p className="text-slate-500 font-medium mb-4">@asilbek_dev</p>

                    <p className="text-slate-600 max-w-xl leading-relaxed mb-4">
                        Fullstack dasturchi va blogger. Texnologiyalar, sun'iy intellekt va shaxsiy rivojlanish haqida yozaman. Doimo o'rganishdaman.
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Toshkent, O'zbekiston
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            2024 yildan beri a'zo
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Sozlamalar
                    </Button>
                    <Button>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Profilni tahrirlash
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
                <div className="text-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">12</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Maqola</p>
                </div>
                <div className="text-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">1.2k</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Obunachi</p>
                </div>
                <div className="text-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">248</p>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Obuna</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                            ? "text-blue-600"
                            : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content based on Tab */}
            <div className="min-h-[200px]">
                {activeTab === 'Maqolalar' && (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400">Hozircha maqolalar topilmadi</p>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Birinchi maqolani yozish</Button>
                    </div>
                )}
                {activeTab !== 'Maqolalar' && (
                    <div className="text-center py-20 text-slate-400">
                        Bu bo'lim tez orada ishga tushadi
                    </div>
                )}
            </div>
        </div>
    );
}
