import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { PaymentOption } from "../components/PaymentOption";
import { TodoBox } from "../components/TodoBox";
import { createOrder } from "../services/orderService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { showMessage } from "../utils/dialog";
import { validatePhone, validateRequired } from "../utils/validators";
import { RootScreenProps } from "../navigation/types";
import { PaymentMethod } from "../types";
import { colors, formatPrice, radius } from "../theme";

export function CheckoutScreen({ navigation, route }: RootScreenProps<"Checkout">) {
  const { isLoggedIn, user } = useAuth();
  const { items, clear } = useCart();
  const total = route.params.total;

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Lớp bảo vệ — CÓ SẴN
  useEffect(() => {
    if (!isLoggedIn) navigation.replace("Login", { redirectTo: "Checkout", total });
  }, [isLoggedIn, navigation, total]);

  // TODO BT9.1a: tính `errors` (name/phone/address) bằng validateRequired / validatePhone
  // và `valid` = không còn lỗi && giỏ còn hàng. Hiện đang tạm = false nên nút luôn bị khoá.
  const errors: { name: string | null; phone: string | null; address: string | null } = { name: null, phone: null, address: null };
  void validatePhone; void validateRequired; void touched; void setName; void setPhone; void setAddress; void setPayment;
  const valid = false;

  const submit = async () => {
    // TODO BT9.2: (1) setTouched(true); nếu !valid || !user thì return
    // (2) bật loading, xoá submitError  (3) await createOrder({...})  (4) clear() giỏ
    // (5) showMessage("Đặt hàng thành công 🎉", ..., () => navigation.navigate("Tabs", { screen: "Home" }))
    // (6) catch → setSubmitError(getErrorMessage(e)) và GIỮ NGUYÊN giỏ  (7) finally tắt loading
    void createOrder; void clear; void showMessage; void getErrorMessage; void setLoading; void setSubmitError; void setTouched; void user;
  };

  if (!isLoggedIn) return null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* CÓ SẴN: tóm tắt đơn hàng */}
        <Text style={styles.h}>Đơn hàng ({items.length} sản phẩm)</Text>
        <View style={styles.summary}>
          {items.map((i) => (
            <View key={i.bookId} style={styles.sumRow}>
              <Text style={styles.sumTitle} numberOfLines={1}>{i.title} × {i.quantity}</Text>
              <Text style={styles.sumPrice}>{formatPrice(i.price * i.quantity)}</Text>
            </View>
          ))}
          <View style={[styles.sumRow, styles.sumTotal]}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <Text style={styles.h}>Địa chỉ giao hàng</Text>
        <TodoBox id="BT9.1b">{"3 ô <FormField>: Họ tên, Số điện thoại, Địa chỉ — truyền error={touched ? errors.x : null}"}</TodoBox>

        <Text style={styles.h}>Phương thức thanh toán</Text>
        <TodoBox id="BT9.1c">{"2 <PaymentOption>: COD và Chuyển khoản (hint \"Chỉ minh hoạ giao diện\"); selected={payment === ...}"}</TodoBox>

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
        {/* Nút đã nối sẵn: bị khoá cho đến khi bạn làm xong BT9.1a */}
        <PrimaryButton title="Xác nhận đặt hàng" onPress={submit} loading={loading} disabled={!valid} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  h: { fontSize: 16, fontWeight: "800", color: colors.navy, marginTop: 6 },
  summary: { backgroundColor: "#fff", borderRadius: radius.md, padding: 12, gap: 6 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  sumTitle: { flex: 1, color: colors.text },
  sumPrice: { fontWeight: "700", color: colors.text },
  sumTotal: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8, marginTop: 4 },
  totalLabel: { fontWeight: "800", color: colors.navy },
  totalValue: { fontWeight: "800", color: colors.indigo, fontSize: 18 },
  error: { color: colors.danger, textAlign: "center" },
});
