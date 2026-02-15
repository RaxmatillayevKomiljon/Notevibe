import { Zap, Users, Star, Flame } from 'lucide-react';

export const features = [
    {
        icon: Zap,
        title: "Kunlik Odatlar",
        desc: "Har kuni yozish odatini shakllantiring. Kichik qadamlar katta natijalarga olib keladi.",
    },
    {
        icon: Flame,
        title: "Streak Tizimi",
        desc: "Yozishni tashlab qo'ymang! Har kuni yozib, olovni so'ndirmaslikka harakat qiling.",
    },
    {
        icon: Star,
        title: "Kudos & XP",
        desc: "Postlaringizga 'Like' emas, 'Kudos' yig'ing. Har bir faollik uchun XP oling va darajangizni oshiring.",
    },
    {
        icon: Users,
        title: "Yopiq Hamjamiyat",
        desc: "Faqat maktab o'quvchilari uchun maxsus, xavfsiz va qo'llab-quvvatlovchi muhit.",
    },
];

export const awards = [
    {
        month: "Mart",
        title: "Eng yaxshi yozuvchi",
        user: "Asilbek T.",
        avatar: "https://api.dicebear.com/7.x/avataaHs/svg?seed=Felix",
    },
    {
        month: "Mart",
        title: "Eng faol izohchi",
        user: "Madina K.",
        avatar: "https://api.dicebear.com/7.x/avataaHs/svg?seed=Aneka",
    },
    {
        month: "Mart",
        title: "Eng ko'p Kudos",
        user: "Javohir A.",
        avatar: "https://api.dicebear.com/7.x/avataaHs/svg?seed=Jude",
    },
];

export const faqs = [
    {
        q: "Notevibe nima o'zi?",
        a: "Notevibe bu o'quvchilar uchun maxsus yaratilgan yozish va fikr almashish platformasi. Bu yerda siz o'z maqolalaringizni yozishingiz, boshqalarni o'qishingiz va yutuqlarga erishishingiz mumkin.",
    },
    {
        q: "Bu yerga kimlar kira oladi?",
        a: "Platforma hozirda faqat tasdiqlangan maktab o'quvchilari uchun ochiq. Kirish uchun maxsus taklifnoma kerak bo'lishi mumkin.",
    },
    {
        q: "Qanday qilib XP ishlashim mumkin?",
        a: "Har kuni kirish, post yozish, izoh qoldirish va Kudos olish orqali XP ishlaysiz.",
    },
];
