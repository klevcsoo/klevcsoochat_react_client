export function getOnlineStatusText(online: boolean, lastOnline: number) {
  if (online) return 'jelenleg online';

  const seconds = (new Date().getTime() - lastOnline) / 1000;
  let offlineSince = { time: seconds, text: 'másodperce' };

  if (seconds >= 60) offlineSince = { time: seconds / 60, text: 'perce' };
  if (seconds >= 3600) offlineSince = { time: seconds / 3600, text: 'órája' };
  if (seconds >= (86400 * 2)) offlineSince = { time: seconds / (86400 * 2), text: 'napja' };

  return `legutóbb online ${Math.round(offlineSince.time)} ${offlineSince.text}`;
}
