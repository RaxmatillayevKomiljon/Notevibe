import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

const translations: Record<Language, Record<string, string>> = {
    uz: {
        // Sidebar
        'nav.home': 'Bosh sahifa',
        'nav.explore': "Kesht etish",
        'nav.bookmarks': 'Saqlanganlar',
        'nav.profile': 'Profil',
        'nav.settings': 'Sozlamalar',
        'nav.newPost': 'Note yozish',
        'nav.logout': 'Chiqish',

        // Dashboard
        'dashboard.title': 'Bosh sahifa',
        'dashboard.search': 'Qidirish...',
        'dashboard.loading': 'Yuklanmoqda...',
        'dashboard.noPosts': "Hozircha postlar yo'q.",
        'dashboard.beFirst': "Birinchi bo'lib siz yozing!",
        'dashboard.suggested': 'Tavsiya etilganlar',
        'dashboard.follow': 'Obuna',
        'dashboard.following': "Obuna bo'lgan",
        'dashboard.unfollow': 'Bekor qilish',
        'dashboard.anonymous': 'Anonim',
        'dashboard.feed': 'Mening lentam',
        'dashboard.trending': 'Trenddagi mavzular',
        'dashboard.noTopics': "Hozircha mavzular yo'q",
        'dashboard.all': 'Barchasi',
        'dashboard.readTime': "o'qish",
        'dashboard.save': 'Saqlash',
        'dashboard.unsave': 'Saqlangandan olib tashlash',
        'dashboard.noSuggestions': "Tavsiyalar yo'q",
        'dashboard.followBtn': "A'zo bo'lish",

        // Explore
        'explore.title': "Kesht etish",
        'explore.search': "Post, muallif yoki mavzu qidirish...",
        'explore.trending': 'Trendlar',
        'explore.all': 'Barchasi',
        'explore.results': 'ta natija topildi',
        'explore.noResults': "Natija topilmadi",

        // Profile
        'profile.title': 'Profil',
        'profile.notes': 'Note',
        'profile.followers': 'Obunachi',
        'profile.followingCount': 'Obuna',
        'profile.kudos': 'Kudos',
        'profile.editProfile': "Profilni tahrirlash",
        'profile.save': 'Saqlash',
        'profile.cancel': 'Bekor qilish',
        'profile.posts': 'Notelar',
        'profile.about': 'Haqida',
        'profile.saved': 'Saqlanganlar',
        'profile.noPosts': "Hali notelar yo'q",
        'profile.writeFirst': "Birinchi noteni yozing!",
        'profile.memberSince': "A'zo bo'lgan sana",
        'profile.loading': 'Yuklanmoqda...',
        'profile.loginRequired': 'Iltimos, tizimga kiring.',
        'profile.user': 'Foydalanuvchi',
        'profile.fullName': "To'liq ism",
        'profile.username': 'Foydalanuvchi nomi',
        'profile.bio': 'Bio',
        'profile.website': 'Veb-sayt',
        'profile.share': 'Ulashish',
        'profile.saving': 'Saqlanmoqda...',
        'profile.profileImage': 'Profil rasmi',
        'profile.bioPlaceholder': "Hozircha ma'lumot yo'q. Profilni tahrirlash orqali bio qo'shing.",
        'profile.info': "Ma'lumotlar",
        'profile.goToSaved': "Saqlanganlar sahifasiga o'tish →",
        'profile.savedNotes': 'Saqlangan notelar',
        'profile.useSavedPage': 'Saqlanganlar sahifasidan foydalaning',

        // Settings
        'settings.title': 'Sozlamalar',
        'settings.account': 'Akkaunt',
        'settings.profileInfo': "Profil ma'lumotlari",
        'settings.profileInfoDesc': 'Ism, rasm va bio',
        'settings.edit': "O'zgartirish",
        'settings.email': 'Email manzili',
        'settings.verified': 'Tasdiqlangan',
        'settings.appSettings': 'Ilova sozlamalari',
        'settings.theme': 'Mavzu',
        'settings.themeLight': "Yorug'",
        'settings.themeDark': "Qorong'i",
        'settings.themeSystem': 'Sistema',
        'settings.press': 'Bosing',
        'settings.language': 'Til',
        'settings.langUz': "O'zbekcha",
        'settings.langRu': 'Русский',
        'settings.langEn': 'English',
        'settings.notifications': 'Bildirishnomalar',
        'settings.notifEnabled': 'Yoqilgan',
        'settings.security': 'Xavfsizlik',
        'settings.changePassword': "Parolni o'zgartirish",
        'settings.changePasswordDesc': "Hisobingiz xavfsizligini ta'minlang",
        'settings.newPassword': 'Yangi parol',
        'settings.newPasswordPlaceholder': 'Kamida 6 ta belgi',
        'settings.confirmPassword': 'Parolni tasdiqlang',
        'settings.confirmPasswordPlaceholder': 'Parolni qayta kiriting',
        'settings.passwordMismatch': 'Parollar mos kelmadi',
        'settings.passwordMinLength': "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        'settings.passwordChanged': "Parol muvaffaqiyatli o'zgartirildi!",
        'settings.passwordError': "Parolni o'zgartirishda xatolik",
        'settings.langChanged': "Til o'zgartirildi",
        'settings.logout': 'Akkauntdan chiqish',

        // Create Post
        'createPost.title': 'Yangi note',
        'createPost.postTitle': 'Sarlavha',
        'createPost.excerpt': 'Qisqa tavsif',
        'createPost.content': 'Matn',
        'createPost.tags': 'Teglar',
        'createPost.coverImage': 'Muqova rasmi',
        'createPost.publish': 'Nashr etish',
        'createPost.publishing': 'Nashr etilmoqda...',

        // Login
        'login.welcome': 'Xush kelibsiz!',
        'login.register': "Ro'yxatdan o'tish",
        'login.registerDesc': "Yangi hisob yarating va jamiyatga qo'shiling.",
        'login.loginDesc': 'Davom etish uchun hisobingizga kiring.',
        'login.google': 'Google orqali kirish',
        'login.or': 'yoki',
        'login.email': 'Email',
        'login.password': 'Parol',
        'login.submit': 'Kirish',
        'login.submitRegister': "Ro'yxatdan o'tish",
        'login.noAccount': "Hisobingiz yo'qmi? Ro'yxatdan o'tish",
        'login.hasAccount': "Hisobingiz bormi? Kirish",
        'login.backHome': 'Bosh sahifaga qaytish',
        'login.wait': 'Kuting...',
        'login.registerSuccess': "Ro'yxatdan o'tish muvaffaqiyatli!",
        'login.registerSuccessLogin': "Ro'yxatdan o'tdingiz! Endi kirish tugmasini bosing.",

        // Bookmarks
        'bookmarks.title': 'Saqlanganlar',
        'bookmarks.empty': "Saqlanganlar bo'sh",
        'bookmarks.emptyDesc': "Postlarni saqlash uchun Bookmark tugmasini bosing",

        // UserProfile
        'userProfile.followBtn': "Obuna bo'lish",
        'userProfile.unfollowBtn': "Obunadan chiqish",
        'userProfile.followersList': 'Obunachilari',
        'userProfile.followingList': 'Obunalari',
        'userProfile.noFollowers': "Obunachilari yo'q",
        'userProfile.noFollowing': "Hech kimga obuna bo'lmagan",

        // Common
        'common.loading': 'Yuklanmoqda...',
        'common.error': 'Xatolik yuz berdi',
        'common.close': 'Yopish',
    },
    ru: {
        // Sidebar
        'nav.home': 'Главная',
        'nav.explore': 'Обзор',
        'nav.bookmarks': 'Закладки',
        'nav.profile': 'Профиль',
        'nav.settings': 'Настройки',
        'nav.newPost': 'Новая заметка',
        'nav.logout': 'Выйти',

        // Dashboard
        'dashboard.title': 'Главная',
        'dashboard.search': 'Поиск...',
        'dashboard.loading': 'Загрузка...',
        'dashboard.noPosts': 'Пока нет постов.',
        'dashboard.beFirst': 'Будьте первым, кто напишет!',
        'dashboard.suggested': 'Рекомендуемые',
        'dashboard.follow': 'Подписаться',
        'dashboard.following': 'Подписан',
        'dashboard.unfollow': 'Отписаться',
        'dashboard.anonymous': 'Аноним',
        'dashboard.feed': 'Моя лента',
        'dashboard.trending': 'Трендовые темы',
        'dashboard.noTopics': 'Пока нет тем',
        'dashboard.all': 'Все',
        'dashboard.readTime': 'чтение',
        'dashboard.save': 'Сохранить',
        'dashboard.unsave': 'Убрать из сохранённых',
        'dashboard.noSuggestions': 'Нет рекомендаций',
        'dashboard.followBtn': 'Подписаться',

        // Explore
        'explore.title': 'Обзор',
        'explore.search': 'Поиск по постам, авторам или темам...',
        'explore.trending': 'Тренды',
        'explore.all': 'Все',
        'explore.results': 'результатов найдено',
        'explore.noResults': 'Ничего не найдено',

        // Profile
        'profile.title': 'Профиль',
        'profile.notes': 'Заметки',
        'profile.followers': 'Подписчики',
        'profile.followingCount': 'Подписки',
        'profile.kudos': 'Кудос',
        'profile.editProfile': 'Редактировать профиль',
        'profile.save': 'Сохранить',
        'profile.cancel': 'Отмена',
        'profile.posts': 'Заметки',
        'profile.about': 'О себе',
        'profile.saved': 'Закладки',
        'profile.noPosts': 'Пока нет заметок',
        'profile.writeFirst': 'Напишите первую заметку!',
        'profile.memberSince': 'Дата регистрации',
        'profile.loading': 'Загрузка...',
        'profile.loginRequired': 'Пожалуйста, войдите в систему.',
        'profile.user': 'Пользователь',
        'profile.fullName': 'Полное имя',
        'profile.username': 'Имя пользователя',
        'profile.bio': 'О себе',
        'profile.website': 'Веб-сайт',
        'profile.share': 'Поделиться',
        'profile.saving': 'Сохранение...',
        'profile.profileImage': 'Фото профиля',
        'profile.bioPlaceholder': 'Пока нет информации. Добавьте био через редактирование профиля.',
        'profile.info': 'Информация',
        'profile.goToSaved': 'Перейти к закладкам →',
        'profile.savedNotes': 'Сохранённые заметки',
        'profile.useSavedPage': 'Используйте страницу закладок',

        // Settings
        'settings.title': 'Настройки',
        'settings.account': 'Аккаунт',
        'settings.profileInfo': 'Информация профиля',
        'settings.profileInfoDesc': 'Имя, фото и био',
        'settings.edit': 'Изменить',
        'settings.email': 'Электронная почта',
        'settings.verified': 'Подтверждён',
        'settings.appSettings': 'Настройки приложения',
        'settings.theme': 'Тема',
        'settings.themeLight': 'Светлая',
        'settings.themeDark': 'Тёмная',
        'settings.themeSystem': 'Система',
        'settings.press': 'Нажмите',
        'settings.language': 'Язык',
        'settings.langUz': "O'zbekcha",
        'settings.langRu': 'Русский',
        'settings.langEn': 'English',
        'settings.notifications': 'Уведомления',
        'settings.notifEnabled': 'Включены',
        'settings.security': 'Безопасность',
        'settings.changePassword': 'Изменить пароль',
        'settings.changePasswordDesc': 'Обеспечьте безопасность аккаунта',
        'settings.newPassword': 'Новый пароль',
        'settings.newPasswordPlaceholder': 'Минимум 6 символов',
        'settings.confirmPassword': 'Подтвердите пароль',
        'settings.confirmPasswordPlaceholder': 'Введите пароль повторно',
        'settings.passwordMismatch': 'Пароли не совпадают',
        'settings.passwordMinLength': 'Пароль должен содержать минимум 6 символов',
        'settings.passwordChanged': 'Пароль успешно изменён!',
        'settings.passwordError': 'Ошибка при изменении пароля',
        'settings.langChanged': 'Язык изменён',
        'settings.logout': 'Выйти из аккаунта',

        // Create Post
        'createPost.title': 'Новая заметка',
        'createPost.postTitle': 'Заголовок',
        'createPost.excerpt': 'Краткое описание',
        'createPost.content': 'Текст',
        'createPost.tags': 'Теги',
        'createPost.coverImage': 'Обложка',
        'createPost.publish': 'Опубликовать',
        'createPost.publishing': 'Публикация...',

        // Login
        'login.welcome': 'Добро пожаловать!',
        'login.register': 'Регистрация',
        'login.registerDesc': 'Создайте аккаунт и присоединяйтесь к сообществу.',
        'login.loginDesc': 'Войдите в свой аккаунт для продолжения.',
        'login.google': 'Войти через Google',
        'login.or': 'или',
        'login.email': 'Электронная почта',
        'login.password': 'Пароль',
        'login.submit': 'Войти',
        'login.submitRegister': 'Зарегистрироваться',
        'login.noAccount': 'Нет аккаунта? Зарегистрироваться',
        'login.hasAccount': 'Есть аккаунт? Войти',
        'login.backHome': 'Вернуться на главную',
        'login.wait': 'Подождите...',
        'login.registerSuccess': 'Регистрация успешна!',
        'login.registerSuccessLogin': 'Регистрация успешна! Теперь войдите.',

        // Bookmarks
        'bookmarks.title': 'Закладки',
        'bookmarks.empty': 'Закладки пусты',
        'bookmarks.emptyDesc': 'Нажмите кнопку закладки, чтобы сохранить пост',

        // UserProfile
        'userProfile.followBtn': 'Подписаться',
        'userProfile.unfollowBtn': 'Отписаться',
        'userProfile.followersList': 'Подписчики',
        'userProfile.followingList': 'Подписки',
        'userProfile.noFollowers': 'Нет подписчиков',
        'userProfile.noFollowing': 'Нет подписок',

        // Common
        'common.loading': 'Загрузка...',
        'common.error': 'Произошла ошибка',
        'common.close': 'Закрыть',
    },
    en: {
        // Sidebar
        'nav.home': 'Home',
        'nav.explore': 'Explore',
        'nav.bookmarks': 'Bookmarks',
        'nav.profile': 'Profile',
        'nav.settings': 'Settings',
        'nav.newPost': 'New Note',
        'nav.logout': 'Logout',

        // Dashboard
        'dashboard.title': 'Home',
        'dashboard.search': 'Search...',
        'dashboard.loading': 'Loading...',
        'dashboard.noPosts': 'No posts yet.',
        'dashboard.beFirst': 'Be the first to write!',
        'dashboard.suggested': 'Suggested',
        'dashboard.follow': 'Follow',
        'dashboard.following': 'Following',
        'dashboard.unfollow': 'Unfollow',
        'dashboard.anonymous': 'Anonymous',
        'dashboard.feed': 'My Feed',
        'dashboard.trending': 'Trending Topics',
        'dashboard.noTopics': 'No topics yet',
        'dashboard.all': 'All',
        'dashboard.readTime': 'read',
        'dashboard.save': 'Save',
        'dashboard.unsave': 'Remove from saved',
        'dashboard.noSuggestions': 'No suggestions',
        'dashboard.followBtn': 'Follow',

        // Explore
        'explore.title': 'Explore',
        'explore.search': 'Search posts, authors or topics...',
        'explore.trending': 'Trending',
        'explore.all': 'All',
        'explore.results': 'results found',
        'explore.noResults': 'No results found',

        // Profile
        'profile.title': 'Profile',
        'profile.notes': 'Notes',
        'profile.followers': 'Followers',
        'profile.followingCount': 'Following',
        'profile.kudos': 'Kudos',
        'profile.editProfile': 'Edit Profile',
        'profile.save': 'Save',
        'profile.cancel': 'Cancel',
        'profile.posts': 'Notes',
        'profile.about': 'About',
        'profile.saved': 'Saved',
        'profile.noPosts': 'No notes yet',
        'profile.writeFirst': 'Write your first note!',
        'profile.memberSince': 'Member since',
        'profile.loading': 'Loading...',
        'profile.loginRequired': 'Please log in.',
        'profile.user': 'User',
        'profile.fullName': 'Full Name',
        'profile.username': 'Username',
        'profile.bio': 'Bio',
        'profile.website': 'Website',
        'profile.share': 'Share',
        'profile.saving': 'Saving...',
        'profile.profileImage': 'Profile Image',
        'profile.bioPlaceholder': 'No info yet. Add a bio by editing your profile.',
        'profile.info': 'Information',
        'profile.goToSaved': 'Go to Bookmarks →',
        'profile.savedNotes': 'Saved notes',
        'profile.useSavedPage': 'Use the bookmarks page',

        // Settings
        'settings.title': 'Settings',
        'settings.account': 'Account',
        'settings.profileInfo': 'Profile Information',
        'settings.profileInfoDesc': 'Name, photo and bio',
        'settings.edit': 'Edit',
        'settings.email': 'Email Address',
        'settings.verified': 'Verified',
        'settings.appSettings': 'App Settings',
        'settings.theme': 'Theme',
        'settings.themeLight': 'Light',
        'settings.themeDark': 'Dark',
        'settings.themeSystem': 'System',
        'settings.press': 'Press',
        'settings.language': 'Language',
        'settings.langUz': "O'zbekcha",
        'settings.langRu': 'Русский',
        'settings.langEn': 'English',
        'settings.notifications': 'Notifications',
        'settings.notifEnabled': 'Enabled',
        'settings.security': 'Security',
        'settings.changePassword': 'Change Password',
        'settings.changePasswordDesc': 'Secure your account',
        'settings.newPassword': 'New Password',
        'settings.newPasswordPlaceholder': 'At least 6 characters',
        'settings.confirmPassword': 'Confirm Password',
        'settings.confirmPasswordPlaceholder': 'Re-enter password',
        'settings.passwordMismatch': 'Passwords do not match',
        'settings.passwordMinLength': 'Password must be at least 6 characters',
        'settings.passwordChanged': 'Password changed successfully!',
        'settings.passwordError': 'Error changing password',
        'settings.langChanged': 'Language changed',
        'settings.logout': 'Log out',

        // Create Post
        'createPost.title': 'New Note',
        'createPost.postTitle': 'Title',
        'createPost.excerpt': 'Short description',
        'createPost.content': 'Content',
        'createPost.tags': 'Tags',
        'createPost.coverImage': 'Cover Image',
        'createPost.publish': 'Publish',
        'createPost.publishing': 'Publishing...',

        // Login
        'login.welcome': 'Welcome!',
        'login.register': 'Sign Up',
        'login.registerDesc': 'Create an account and join the community.',
        'login.loginDesc': 'Log in to your account to continue.',
        'login.google': 'Sign in with Google',
        'login.or': 'or',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.submit': 'Log In',
        'login.submitRegister': 'Sign Up',
        'login.noAccount': "Don't have an account? Sign Up",
        'login.hasAccount': 'Already have an account? Log In',
        'login.backHome': 'Back to Home',
        'login.wait': 'Please wait...',
        'login.registerSuccess': 'Registration successful!',
        'login.registerSuccessLogin': 'Registered! Now log in.',

        // Bookmarks
        'bookmarks.title': 'Bookmarks',
        'bookmarks.empty': 'No bookmarks yet',
        'bookmarks.emptyDesc': 'Click the bookmark button to save posts',

        // UserProfile
        'userProfile.followBtn': 'Follow',
        'userProfile.unfollowBtn': 'Unfollow',
        'userProfile.followersList': 'Followers',
        'userProfile.followingList': 'Following',
        'userProfile.noFollowers': 'No followers',
        'userProfile.noFollowing': 'Not following anyone',

        // Common
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.close': 'Close',
    },
};

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
    language: 'uz',
    setLanguage: () => { },
    t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('notevibe-lang') as Language) || 'uz';
    });

    function setLanguage(lang: Language) {
        setLanguageState(lang);
        localStorage.setItem('notevibe-lang', lang);
    }

    function t(key: string): string {
        return translations[language]?.[key] || translations['uz']?.[key] || key;
    }

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    return useContext(I18nContext);
}
