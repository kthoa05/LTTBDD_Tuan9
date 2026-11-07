import { api } from "../api/client";
import { AppNotification } from "../types";

// TODO BT9.5a: GET /notifications?userId=…&_sort=createdAt&_order=desc
export async function getNotifications(userId: number): Promise<AppNotification[]> {
  void api; void userId;
  throw new Error("TODO BT9.5a: chưa viết getNotifications");
}

// TODO BT9.5b: PATCH /notifications/:id với { read: true }
export async function markAsRead(id: number): Promise<AppNotification> {
  void id;
  throw new Error("TODO BT9.5b: chưa viết markAsRead");
}
