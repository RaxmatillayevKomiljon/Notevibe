/**
 * Push Notification tizimi
 * Brauzer orqali haqiqiy bildirishnomalar yuboradi (Telegram kabi)
 */

// Bildirishnoma turlariga mos matnlar
const NOTIFICATION_MESSAGES: Record<string, { title: string; getBody: (actorName: string, postTitle?: string) => string }> = {
    kudos: {
        title: '👍 Yangi Kudos!',
        getBody: (name, post) => `${name} "${post || 'post'}" maqolangizni yoqtirdi`
    },
    comment: {
        title: '💬 Yangi Izoh!',
        getBody: (name, post) => `${name} "${post || 'post'}" maqolangizga izoh qoldirdi`
    },
    follow: {
        title: '👤 Yangi Obunachi!',
        getBody: (name) => `${name} sizga obuna bo'ldi`
    },
    book_request: {
        title: '📚 Kitob So\'rovi!',
        getBody: (name) => `${name} kitob qo'shish so'rovini yubordi`
    },
    borrow_request: {
        title: '📖 Kitob Olish So\'rovi!',
        getBody: (name) => `${name} kitob olishni so'ramoqda`
    },
    book_approved: {
        title: '✅ Kitob Tasdiqlandi!',
        getBody: () => `Sizning kitobingiz kutubxonaga qo'shildi`
    },
    borrow_approved: {
        title: '✅ So\'rov Tasdiqlandi!',
        getBody: () => `Kitob olish so'rovingiz tasdiqlandi`
    }
};

/**
 * Brauzer bildirishnomalariga ruxsat so'rash
 */
export async function requestNotificationPermission(): Promise<boolean> {
    // Brauzer qo'llab-quvvatlamasa
    if (!('Notification' in window)) {
        console.warn('Bu brauzer bildirishnomalarni qo\'llab-quvvatlamaydi');
        return false;
    }

    // Allaqachon ruxsat berilgan bo'lsa
    if (Notification.permission === 'granted') {
        return true;
    }

    // Rad etilgan bo'lsa
    if (Notification.permission === 'denied') {
        console.warn('Bildirishnomalar rad etilgan');
        return false;
    }

    // Ruxsat so'rash
    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * Bildirishnoma yuborish
 */
export function sendBrowserNotification(
    type: string,
    actorName: string,
    postTitle?: string
): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const config = NOTIFICATION_MESSAGES[type];
    if (!config) return;

    const notification = new Notification(config.title, {
        body: config.getBody(actorName, postTitle),
        icon: '/pwa-192x192.svg',
        badge: '/pwa-192x192.svg',
        tag: `notevibe-${type}-${Date.now()}`,
        requireInteraction: false,
        silent: false
    });

    // Bildirishnoma bosilganda ilovaga o'tish
    notification.onclick = () => {
        window.focus();
        if (type === 'follow') {
            window.location.href = '/notifications';
        } else {
            window.location.href = '/notifications';
        }
        notification.close();
    };

    // 5 soniyadan keyin avtomatik yopiladi
    setTimeout(() => notification.close(), 5000);
}

/**
 * Ruxsat holatini tekshirish
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
}
