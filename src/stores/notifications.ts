export async function  requestNotifPerm() {
    const isOk = await Notification.requestPermission()
}

export async function sendNotification(text: string) {
    if (Notification.permission === 'granted')
        new Notification(text);
}