import webPush from "web-push";

// Initialize web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@pabuk.ai";

if (vapidPublicKey && vapidPrivateKey) {
    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushSubscriptionData {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    data?: Record<string, unknown>;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
}

/**
 * Send a push notification to a single subscription
 */
export async function sendPushNotification(
    subscription: PushSubscriptionData,
    payload: NotificationPayload
): Promise<boolean> {
    if (!vapidPublicKey || !vapidPrivateKey) {
        console.warn("VAPID keys not configured. Push notifications disabled.");
        return false;
    }

    try {
        const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        };

        await webPush.sendNotification(
            pushSubscription,
            JSON.stringify(payload),
            {
                TTL: 60 * 60 * 24, // 24 hours
                urgency: "normal",
            }
        );

        return true;
    } catch (error) {
        // Check if subscription is expired/invalid
        if ((error as { statusCode?: number }).statusCode === 410) {
            console.log("Push subscription expired:", subscription.endpoint);
            // Return false to indicate the subscription should be removed
            return false;
        }
        console.error("Error sending push notification:", error);
        throw error;
    }
}

/**
 * Generate VAPID keys for push notifications
 * Run this once and save the keys to your environment variables
 */
export function generateVapidKeys(): { publicKey: string; privateKey: string } {
    const keys = webPush.generateVAPIDKeys();
    return {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
    };
}

/**
 * Pre-built notification templates for common events
 */
export const notificationTemplates = {
    pointsEarned: (points: number, reason: string): NotificationPayload => ({
        title: "🎉 คุณได้รับคะแนน!",
        body: `+${points} คะแนน จาก${reason}`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "points-earned",
        data: {
            type: "points",
            url: "/dashboard",
        },
        actions: [
            {
                action: "view",
                title: "ดูแดชบอร์ด",
            },
        ],
    }),

    achievementUnlocked: (badgeName: string): NotificationPayload => ({
        title: "🏆 ปลดล็อกความสำเร็จ!",
        body: `คุณได้รับเหรียญ "${badgeName}"`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "achievement",
        data: {
            type: "achievement",
            url: "/dashboard",
        },
        actions: [
            {
                action: "view",
                title: "ดูความสำเร็จ",
            },
        ],
    }),

    contributionApproved: (title: string): NotificationPayload => ({
        title: "✅ ข้อมูลได้รับการอนุมัติ",
        body: `"${title}" ได้รับการอนุมัติแล้ว`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "contribution-approved",
        data: {
            type: "contribution",
            url: "/dashboard",
        },
    }),

    streakReminder: (currentStreak: number): NotificationPayload => ({
        title: "🔥 อย่าลืมส่งข้อมูลวันนี้!",
        body: `รักษา streak ${currentStreak} วันของคุณไว้`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "streak-reminder",
        data: {
            type: "streak",
            url: "/submit",
        },
        actions: [
            {
                action: "submit",
                title: "ส่งข้อมูล",
            },
        ],
    }),

    leaderboardUpdate: (rank: number): NotificationPayload => ({
        title: "📊 อัพเดตลีดเดอร์บอร์ด",
        body: `คุณอยู่อันดับที่ ${rank} ในตาราง`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "leaderboard",
        data: {
            type: "leaderboard",
            url: "/leaderboard",
        },
    }),
};

/**
 * Utility to get VAPID public key for client-side subscription
 */
export function getVapidPublicKey(): string | null {
    return vapidPublicKey || null;
}
