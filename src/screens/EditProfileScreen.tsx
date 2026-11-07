import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { TodoBox } from "../components/TodoBox";
import { updateProfile } from "../services/userService";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { showMessage } from "../utils/dialog";
import { validatePhone, validateRequired } from "../utils/validators";
import { RootScreenProps } from "../navigation/types";
import { colors } from "../theme";

// Bản rút gọn: chỉ sửa tên + SĐT (bỏ ảnh đại diện, đổi mật khẩu)
export function EditProfileScreen({ navigation }: RootScreenProps<"EditProfile">) {
  const { user, patchUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = { name: validateRequired("họ tên")(name), phone: validatePhone(phone) };

  const save = async () => {
    // TODO BT9.4b: setTouched(true); nếu có lỗi hoặc !user thì return; bật loading;
    // const updated = await updateProfile(user.id, {name: name.trim(), phone: phone.trim()});
    // patchUser(updated) (cập nhật STORE); showMessage("Đã lưu", ..., () => navigation.goBack()); catch → setSubmitError; finally tắt loading
    void updateProfile; void patchUser; void showMessage; void getErrorMessage; void navigation; void setTouched; void setLoading; void setSubmitError;
  };

  void setName; void setPhone; void touched; void errors; void FormField;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TodoBox id="BT9.4a">{"3 ô FormField: Email (editable={false}, mờ), Họ tên, Số điện thoại — lỗi hiện dưới ô khi touched."}</TodoBox>
      {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
      <PrimaryButton title="Lưu thay đổi" onPress={save} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  error: { color: colors.danger, textAlign: "center" },
});
