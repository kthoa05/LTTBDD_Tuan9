import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NotificationItem } from "../components/NotificationItem";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { TodoBox } from "../components/TodoBox";
import { getNotifications, markAsRead } from "../services/notificationService";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { AppNotification } from "../types";
import { colors } from "../theme";

export function NotificationsScreen({ navigation }: RootScreenProps<"Notifications">) {
  const { user, isLoggedIn } = useAuth();
  const [data, setData] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    // TODO BT9.5c: if (!user) return; loading=true, error=null; setData(await getNotifications(user.id)); catch/finally như các màn khác
    void getNotifications; void getErrorMessage; void setData; void setError;
    setLoading(false);
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  const open = async (n: AppNotification) => {
    // TODO BT9.5d: (1) nếu chưa đọc: cập nhật giao diện NGAY (read:true) rồi gọi markAsRead(n.id); lỗi → hoàn lại read:false
    // (2) điều hướng: target.screen === "Orders" → navigate("Orders"); "BookDetail" → navigate("BookDetail", { bookId })
    void n; void markAsRead; void navigation;
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  void NotificationItem; void open;
  return (
    <View style={styles.container}>
      <TodoBox id="BT9.5e">{"FlatList thông báo: renderItem={({item}) => <NotificationItem item={item} onPress={open} />}; ListEmptyComponent: “Chưa có thông báo nào”. Data hiện có: " + data.length}</TodoBox>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg, padding: 12 } });
