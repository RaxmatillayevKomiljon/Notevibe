import { PenTool, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <PenTool className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">Notevibe</span>
                    </div>

                    <p className="text-slate-500 text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for students.
                    </p>

                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Notevibe. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
