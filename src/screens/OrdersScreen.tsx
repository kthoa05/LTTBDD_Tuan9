import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { TodoBox } from "../components/TodoBox";
import { getOrdersByUser } from "../services/orderService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { formatDateTime } from "../utils/format";
import { showMessage } from "../utils/dialog";
import { RootScreenProps } from "../navigation/types";
import { Order } from "../types";
import { colors, formatPrice, radius } from "../theme";

export const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" } as const;

export function OrdersScreen({ navigation }: RootScreenProps<"Orders">) {
  const { user, isLoggedIn } = useAuth();
  const { items: cartItems, add, setQty } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null); // đơn đang mở rộng (xem chi tiết ngay tại màn này)

  const load = useCallback(async () => {
    // TODO BT9.3a: if (!user) return; bật loading, xoá error; gọi getOrdersByUser(user.id);
    // SẮP XẾP LẠI ở client: mới nhất lên đầu (b.createdAt.localeCompare(a.createdAt)); catch → setError(getErrorMessage(e)); finally tắt loading
    void getOrdersByUser; void getErrorMessage; void setOrders; void setError;
    setLoading(false);
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  // TODO BT9.C1 (thử thách "Mua lại"): thêm lại toàn bộ sản phẩm của đơn vào giỏ hiện tại
  const reorder = async (order: Order) => {
    void order; void getBooks; void cartItems; void add; void setQty; void showMessage;
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  void StatusBadge; void PrimaryButton; void formatDateTime; void formatPrice; void radius; void colors; void reorder; void setOpenId; void openId;
  return (
    <View style={styles.container}>
      <TodoBox id="BT9.3b">{"FlatList đơn hàng: mỗi thẻ có Đơn #id, ngày (formatDateTime), tổng tiền, <StatusBadge>; bấm vào thẻ → mở rộng chi tiết sản phẩm + địa chỉ giao ngay trên màn này (openId)."}</TodoBox>
      <TodoBox id="BT9.3c">{"ListEmptyComponent: <EmptyState emoji=\"🧾\" title=\"Bạn chưa có đơn hàng nào\" …> có nút “Mua sắm ngay”."}</TodoBox>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg, padding: 12, gap: 10 } });
