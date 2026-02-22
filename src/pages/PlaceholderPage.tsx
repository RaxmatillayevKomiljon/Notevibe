import { Construction } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
    title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-500 mb-8 max-w-sm">
                Ushbu sahifa hozirda ishlab chiqilmoqda. Tez orada bu yerda ajoyib imkoniyatlar paydo bo'ladi!
            </p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
                Bosh sahifaga qaytish
            </Button>
        </div>
    );
}
