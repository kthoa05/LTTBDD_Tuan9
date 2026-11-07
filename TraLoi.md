# Trả lời câu hỏi bổ sung — Buổi 9 BookStore

## 1. Giá trị dẫn xuất

`errors` và `valid` được tính trực tiếp từ state mỗi lần render, không dùng `useState` riêng vì chúng là dữ liệu suy ra từ `name`, `phone`, `address` và giỏ hàng. Nếu dùng `useState` riêng, mỗi chỗ gọi `setName`, `setPhone`, `setAddress` đều phải cập nhật thêm state lỗi; chỉ cần quên một chỗ là thông báo lỗi hoặc trạng thái nút bị sai so với dữ liệu đang nhập. Tính lại mỗi lần render thì lỗi luôn khớp với ô nhập.

## 2. Thứ tự gọi `clear()`

Nếu `clear()` chạy trước `await createOrder(...)`, giỏ đã rỗng ngay khi người dùng bấm đặt, nhưng đơn chưa được tạo. Khi mất mạng, request thất bại và người dùng mất hết sản phẩm đã chọn, mà không có cách nào khôi phục ngoài việc tự chọn lại. Đặt `clear()` ngay sau `await createOrder(...)` thì giỏ chỉ bị xoá khi server đã nhận đơn; nếu lỗi, `catch` chỉ hiện thông báo và giỏ còn nguyên.

## 3. PUT hay PATCH

Với `PUT /users/1` và body `{ name, phone }`, server thay toàn bộ object bằng đúng hai trường này. Khi đó `email`, `password` và các trường khác của user bị mất, và lần đăng nhập sau sẽ hỏng. `PATCH` chỉ đổi các trường được gửi lên, nên email và mật khẩu được giữ nguyên. Vì form này chỉ sửa một phần thông tin, `PATCH` là lựa chọn an toàn hơn.

## 4. Cập nhật lạc quan

Nếu bỏ đoạn `setData(... read: false ...)` trong `catch`, khi mất mạng giao diện vẫn hiện "đã đọc" trong khi server chưa ghi nhận. Khi người dùng mở lại màn, thông báo quay về "chưa đọc", gây nhầm lẫn. Chức năng khác nên dùng cách này là **thả tim / thêm vào yêu thích**: thao tác nhẹ, rủi ro thấp, và nếu lỗi thì hoàn lại trạng thái dễ dàng. **Thanh toán thì không nên dùng**: người dùng phải thấy kết quả thật từ server, nếu báo "đặt hàng thành công" khi server chưa ghi nhận thì họ có thể tưởng đã thanh toán trong khi đơn chưa được tạo.

## 5. Bộ lọc trạng thái ở màn Đơn hàng

Thêm một state `statusFilter` kiểu `"all" | OrderStatus` (mặc định `"all"`), và một hàng nút chip để người dùng chọn. Điểm sửa trong dữ liệu truyền cho `FlatList` là `data` lấy từ danh sách đã lọc thay vì danh sách gốc:

```tsx
const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

const visibleOrders = useMemo(
  () => (statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter)),
  [orders, statusFilter]
);

<FlatList data={visibleOrders} ... />
```

Danh sách gốc `orders` vẫn giữ nguyên thứ tự mới nhất lên đầu nên khi lọc, các đơn còn lại vẫn đúng thứ tự. Khi có đơn nhưng không đơn nào khớp bộ lọc, màn hiện thông báo "Không có đơn nào ở trạng thái này" thay vì thông báo "Bạn chưa có đơn hàng nào".
