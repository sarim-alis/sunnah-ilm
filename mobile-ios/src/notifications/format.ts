export type NotificationGroup = 'today' | 'yesterday' | 'earlier';
export type NotificationAccent = 'green' | 'red' | 'blue' | 'none';
export type NotificationIcon =
  | 'notifications-outline'
  | 'time-outline'
  | 'bookmark-outline'
  | 'sparkles-outline';

const STYLES: {
  accent: NotificationAccent;
  icon: NotificationIcon;
}[] = [
  { accent: 'green', icon: 'notifications-outline' },
  { accent: 'red', icon: 'time-outline' },
  { accent: 'blue', icon: 'bookmark-outline' },
  { accent: 'none', icon: 'sparkles-outline' },
];

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function notificationGroup(createdAt: string): NotificationGroup {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'today';
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date >= today) return 'today';
  if (date >= yesterday) return 'yesterday';
  return 'earlier';
}

export function notificationTimeAgo(createdAt: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function notificationStyle(id: string) {
  let total = 0;
  for (const char of id) total += char.charCodeAt(0);
  return STYLES[total % STYLES.length];
}
