import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { NotificationItem } from "../components/NotificationItem";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
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
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setData(await getNotifications(user.id));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  const open = async (n: AppNotification) => {
    // TODO BT9.5d: (1) nếu chưa đọc: cập nhật giao diện NGAY (read:true) rồi gọi markAsRead(n.id); lỗi → hoàn lại read:false
    // (2) điều hướng: target.screen === "Orders" → navigate("Orders"); "BookDetail" → navigate("BookDetail", { bookId })
    // (1) đổi giao diện trước, gọi API sau; API lỗi thì hoàn lại trạng thái chưa đọc
    if (!n.read) {
      setData((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      markAsRead(n.id).catch(() =>
        setData((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: false } : x)))
      );
    }
    // (2) chuyển màn theo đích của thông báo (nếu có)
    if (n.target?.screen === "Orders") navigation.navigate("Orders");
    else if (n.target?.screen === "BookDetail" && n.target.bookId) navigation.navigate("BookDetail", { bookId: n.target.bookId });
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      {/* TODO BT9.5e: FlatList thông báo: renderItem={({item}) => <NotificationItem item={item} onPress={open} />}; ListEmptyComponent: "Chưa có thông báo nào". */}
      <FlatList
        data={data}
        keyExtractor={(n) => String(n.id)}
        contentContainerStyle={{ gap: 8, flexGrow: 1 }}
        renderItem={({ item }) => <NotificationItem item={item} onPress={open} />}
        ListEmptyComponent={<EmptyState emoji="🔔" title="Chưa có thông báo nào" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg, padding: 12 } });
