import { ChatMessage } from './interfaces';
import { getUID } from './firebase';

export function getOnlineStatusText(online: boolean, lastOnline: number) {
  if (online) return 'jelenleg online';

  const seconds = (new Date().getTime() - lastOnline) / 1000;
  let offlineSince = { time: seconds, text: 'másodperce' };

  if (seconds >= 60) offlineSince = { time: seconds / 60, text: 'perce' };
  if (seconds >= 3600) offlineSince = { time: seconds / 3600, text: 'órája' };
  if (seconds >= (86400 * 2)) offlineSince = { time: seconds / (86400 * 2), text: 'napja' };

  return `legutóbb online ${Math.round(offlineSince.time)} ${offlineSince.text}`;
}

export function initializeNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    console.log(`Notification permission is already ${Notification.permission}`);
    return;
  }

  Notification.requestPermission().then((permission) => {
    console.log(`Notification permission is ${permission}`);
  });
}

export function onMessageNotification(message: ChatMessage) {
  if (!('Notification' in window) || Notification.permission === 'denied') return;
  if (message.sent < (new Date().getTime() - 5000) || message.author.id === getUID()) return;
  if (Notification.permission === 'default') Notification.requestPermission();

  new Notification(message.author.name || message.author.id, {
    body: message.type === 'text' ? message.content : undefined,
    image: message.type === 'image' ? message.content : undefined,
    icon: '/logo192.png'
  });
}
