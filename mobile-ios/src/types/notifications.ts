export type AppNotification = {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
};

export type CreateNotificationInput = {
  title: string;
  description: string;
  isRead?: boolean;
};
