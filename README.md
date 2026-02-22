# 📝 Notevibe

**Notevibe** — bu zamonaviy blog va eslatmalar platformasi bo'lib, foydalanuvchilarga o'z fikrlari, maqolalari va eslatmalarini yaratish, boshqarish va ulashish imkonini beradi. Platforma **React**, **TypeScript** va **Supabase** texnologiyalari asosida qurilgan.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.95-3FCF8E?logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🚀 Xususiyatlar

- 🔐 **Autentifikatsiya** — Supabase Auth orqali ro'yxatdan o'tish va tizimga kirish
- 👤 **Foydalanuvchi profili** — Profil ma'lumotlarini tahrirlash, avatar rasm yuklash
- ✍️ **Post yaratish** — Sarlavha, qisqacha mazmun, kontent, muqova rasm va teglar bilan maqola yozish
- 📰 **Dashboard** — Barcha postlarni ko'rib chiqish va boshqarish
- 🔖 **Saqlanganlar** — Sevimli maqolalarni saqlash *(ishlab chiqilmoqda)*
- 🔍 **Kashf etish** — Yangi maqolalar va mualliflarni topish *(ishlab chiqilmoqda)*
- ⚙️ **Sozlamalar** — Shaxsiy sozlamalarni boshqarish
- 🎨 **Zamonaviy UI** — TailwindCSS va Lucide ikonkalar bilan chiroyli interfeys

---

## 🛠️ Texnologiya steki

| Texnologiya | Maqsad |
|---|---|
| **React 18** | UI kutubxonasi |
| **TypeScript** | Tipli xavfsiz dasturlash |
| **Vite** | Tezkor dastur qurish vositasi |
| **Supabase** | Backend (Auth, Database, Storage) |
| **TailwindCSS** | Utility-first CSS framework |
| **React Router v7** | Sahifalar navigatsiyasi |
| **Lucide React** | Ikonkalar kutubxonasi |
| **Radix UI** | Accessibility-ready UI primitivlar |
| **Vercel** | Deployment (hosting) |

---

## 📁 Loyiha tuzilmasi

```
Notevibe/
├── public/                   # Statik fayllar
├── src/
│   ├── components/
│   │   ├── app/              # AppLayout, Sidebar
│   │   ├── auth/             # AuthProvider (autentifikatsiya konteksti)
│   │   ├── landing/          # Landing sahifa komponentlari
│   │   │   ├── Hero.tsx      # Bosh sahifa bosh qismi
│   │   │   ├── FeatureGrid.tsx
│   │   │   ├── Steps.tsx
│   │   │   ├── Awards.tsx
│   │   │   ├── Safety.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   ├── layout/           # Header, Footer
│   │   └── ui/               # Button, Card, Toast
│   ├── data/                 # Ma'lumotlar
│   ├── lib/
│   │   ├── supabase.ts       # Supabase mijoz sozlamalari
│   │   ├── types.ts          # TypeScript tiplar (Profile, Post)
│   │   └── utils.ts          # Yordamchi funksiyalar
│   ├── pages/
│   │   ├── LandingPage.tsx   # Bosh sahifa
│   │   ├── LoginPage.tsx     # Kirish/Ro'yxatdan o'tish
│   │   ├── Dashboard.tsx     # Asosiy panel
│   │   ├── CreatePost.tsx    # Yangi post yaratish
│   │   ├── Profile.tsx       # Foydalanuvchi profili
│   │   ├── Settings.tsx      # Sozlamalar
│   │   └── PlaceholderPage.tsx
│   ├── App.tsx               # Asosiy ilova + marshrutlash
│   ├── main.tsx              # React kirish nuqtasi
│   └── index.css             # Global stillar
├── supabase/
│   └── schema.sql            # Ma'lumotlar bazasi sxemasi
├── .env.example              # Muhit o'zgaruvchilari namunasi
├── tailwind.config.js        # TailwindCSS sozlamalari
├── vite.config.ts            # Vite sozlamalari
├── vercel.json               # Vercel deployment sozlamalari
└── package.json
```

---

## ⚡ Tez boshlash

### Talablar

- **Node.js** v18 yoki undan yuqori
- **npm** yoki **yarn**
- **Supabase** hisobi ([supabase.com](https://supabase.com))

### O'rnatish

1. **Repozitoriyani klonlash:**

```bash
git clone https://github.com/RaxmatillayevKomiljon/Notevibe.git
cd Notevibe
```

2. **Bog'liqliklarni o'rnatish:**

```bash
npm install
```

3. **Muhit o'zgaruvchilarini sozlash:**

`.env.example` faylidan nusxa oling va kerakli qiymatlarni kiriting:

```bash
cp .env.example .env
```

`.env` faylini tahrirlang:

```env
VITE_SUPABASE_URL=sizning_supabase_url
VITE_SUPABASE_ANON_KEY=sizning_supabase_anon_key
```

4. **Supabase ma'lumotlar bazasini sozlash:**

Supabase Dashboard → SQL Editor da `supabase/schema.sql` faylidagi SQL kodini ishga tushiring. Bu quyidagilarni yaratadi:

- `profiles` jadvali (foydalanuvchi profillari)
- `posts` jadvali (maqolalar)
- `images` storage bucket (rasmlar uchun)
- Row Level Security (RLS) siyosatlari

5. **Dasturni ishga tushirish:**

```bash
npm run dev
```

Dastur `http://localhost:5173` manzilida ishga tushadi.

---

## 📜 Mavjud skriptlar

| Buyruq | Tavsif |
|---|---|
| `npm run dev` | Dasturni development rejimida ishga tushirish |
| `npm run build` | Production uchun dasturni qurish |
| `npm run preview` | Production build'ni ko'rib chiqish |
| `npm run lint` | ESLint bilan kodlarni tekshirish |

---

## 🗄️ Ma'lumotlar bazasi sxemasi

### `profiles` jadvali

| Ustun | Turi | Tavsif |
|---|---|---|
| `id` | `uuid` | Foydalanuvchi ID (auth.users bilan bog'langan) |
| `username` | `text` | Unikal foydalanuvchi nomi (min 3 belgi) |
| `full_name` | `text` | To'liq ism |
| `avatar_url` | `text` | Profil rasm URL |
| `website` | `text` | Veb-sayt |
| `updated_at` | `timestamptz` | Oxirgi yangilanish vaqti |

### `posts` jadvali

| Ustun | Turi | Tavsif |
|---|---|---|
| `id` | `uuid` | Post ID |
| `author_id` | `uuid` | Muallif ID |
| `title` | `text` | Sarlavha |
| `excerpt` | `text` | Qisqacha mazmun |
| `content` | `text` | To'liq kontent |
| `cover_image` | `text` | Muqova rasm URL |
| `tags` | `text[]` | Teglar ro'yxati |
| `likes_count` | `integer` | Yoqtirishlar soni |
| `created_at` | `timestamptz` | Yaratilgan vaqt |
| `updated_at` | `timestamptz` | Yangilangan vaqt |

---

## 🌐 Deployment

Loyiha **Vercel** uchun tayyor sozlangan. Deploy qilish uchun:

1. [Vercel](https://vercel.com) ga kiring
2. GitHub repozitoriyangizni ulang
3. Muhit o'zgaruvchilarini qo'shing (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. **Deploy** tugmasini bosing

---

## 🤝 Hissa qo'shish

1. Repozitoriyani **fork** qiling
2. Yangi branch yarating: `git checkout -b feature/yangi-xususiyat`
3. O'zgarishlaringizni commit qiling: `git commit -m "feat: yangi xususiyat qo'shildi"`
4. Push qiling: `git push origin feature/yangi-xususiyat`
5. **Pull Request** yarating

---

## 📄 Litsenziya

Ushbu loyiha [MIT](LICENSE) litsenziyasi ostida tarqatiladi.

---

## 👤 Muallif

**Raxmatillayev Komiljon**

- GitHub: [@RaxmatillayevKomiljon](https://github.com/RaxmatillayevKomiljon)

---

> ✨ *Notevibe — fikrlaringizni yozing, ulashing va ilhomlantiring!*
