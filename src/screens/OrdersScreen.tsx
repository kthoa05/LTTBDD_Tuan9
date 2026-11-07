import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
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
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  // TODO BT9.C1 (thử thách "Mua lại"): thêm lại toàn bộ sản phẩm của đơn vào giỏ hiện tại
  const reorder = async (order: Order) => {
    try {
      // Lấy giá và tồn kho mới nhất, vì giá trong đơn cũ có thể đã khác
      const books = await getBooks();
      order.items.forEach((it) => {
        const book = books.find((b) => b.id === it.bookId);
        if (!book || book.stock <= 0) return; // sách đã ngừng bán hoặc hết hàng thì bỏ qua
        const inCart = cartItems.find((c) => c.bookId === it.bookId);
        if (!inCart) add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock });
        setQty(it.bookId, (inCart?.quantity ?? 0) + it.quantity); // setQty tự chặn ở tồn kho
      });
      showMessage("Đã thêm vào giỏ", "Các sản phẩm của đơn hàng đã được thêm lại vào giỏ.", () =>
        navigation.navigate("Tabs", { screen: "Cart" })
      );
    } catch (e) {
      showMessage("Không thể mua lại", getErrorMessage(e));
    }
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  void StatusBadge; void PrimaryButton; void formatDateTime; void formatPrice; void radius; void colors; void reorder; void setOpenId; void openId;
  return (
    <View style={styles.container}>
      {/* TODO BT9.3b: FlatList đơn hàng: mỗi thẻ có Đơn #id, ngày (formatDateTime), tổng tiền, <StatusBadge>; bấm vào thẻ → mở rộng chi tiết sản phẩm + địa chỉ giao ngay trên màn này (openId). */}
      {/* TODO BT9.3c: ListEmptyComponent: <EmptyState emoji="🧾" title="Bạn chưa có đơn hàng nào" …> có nút "Mua sắm ngay". */}
      <FlatList
        data={orders}
        keyExtractor={(o) => String(o.id)}
        contentContainerStyle={{ gap: 10, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            emoji="🧾"
            title="Bạn chưa có đơn hàng nào"
            message="Đặt đơn đầu tiên để theo dõi tại đây."
            actionLabel="Mua sắm ngay"
            onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
          />
        }
        renderItem={({ item: o }) => {
          const open = openId === o.id;
          return (
            <View style={styles.card}>
              <Pressable onPress={() => setOpenId(open ? null : o.id)} style={styles.head}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.code}>Đơn #{o.id}</Text>
                  <Text style={styles.date}>{formatDateTime(o.createdAt)}</Text>
                  <Text style={styles.total}>{formatPrice(o.total)}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <StatusBadge status={o.status} />
                  <Text style={styles.toggle}>{open ? "Thu gọn ▲" : "Chi tiết ▼"}</Text>
                </View>
              </Pressable>
              {open && (
                <View style={styles.detail}>
                  {o.items.map((it) => (
                    <View key={it.bookId} style={styles.itemRow}>
                      <Text style={styles.itemTitle} numberOfLines={1}>{it.title} × {it.quantity}</Text>
                      <Text style={styles.itemPrice}>{formatPrice(it.price * it.quantity)}</Text>
                    </View>
                  ))}
                  <View style={styles.addr}>
                    <Text style={styles.addrH}>Giao đến</Text>
                    <Text style={styles.addrT}>{o.address.name} · {o.address.phone}</Text>
                    <Text style={styles.addrT}>{o.address.address}</Text>
                    <Text style={styles.addrT}>Thanh toán: {PAYMENT_LABEL[o.paymentMethod]}</Text>
                  </View>
                  {o.status === "completed" && <PrimaryButton title="Mua lại" variant="outline" onPress={() => reorder(o)} />}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 12, gap: 10 },
  card: { backgroundColor: "#fff", borderRadius: radius.md, padding: 12, gap: 10 },
  head: { flexDirection: "row", gap: 8 },
  code: { fontWeight: "800", color: colors.navy },
  date: { color: colors.muted, fontSize: 12 },
  total: { fontWeight: "800", color: colors.indigo },
  toggle: { color: colors.indigo, fontWeight: "700", fontSize: 12 },
  detail: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, gap: 6 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { fontWeight: "700", color: colors.text },
  addr: { backgroundColor: colors.bg, borderRadius: radius.md, padding: 10, gap: 2, marginTop: 4 },
  addrH: { fontWeight: "800", color: colors.navy },
  addrT: { color: colors.text },
});
