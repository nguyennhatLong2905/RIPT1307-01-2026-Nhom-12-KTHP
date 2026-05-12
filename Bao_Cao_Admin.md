# BÁO CÁO HOÀN THIỆN CHỨC NĂNG TRANG QUẢN TRỊ (ADMIN) - LUXE CINEMA

Dưới đây là tài liệu tổng hợp toàn bộ các chức năng đã được xây dựng hoàn thiện trên giao diện quản trị (Admin) của dự án. File này giải thích chi tiết logic hoạt động của từng tính năng để cả nhóm dễ dàng nắm bắt và team Backend có thể dựa vào để thiết kế Database / API.

---

## THÔNG TIN ĐĂNG NHẬP (TESTING)
Hiện tại giao diện đã được khóa lại bằng Route Guard. Nếu chưa đăng nhập sẽ bị đẩy ra trang Login.
*   **Link truy cập:** `http://localhost:3000/admin`
*   **Email:** `admin@luxecinema.vn`
*   **Mật khẩu:** `admin123`
*(Giao diện đã giả lập độ trễ kết nối API và lưu token ảo vào LocalStorage. Bấm "Đăng Xuất" ở Sidebar sẽ xóa token và quay về trang đăng nhập).*

---

## CHI TIẾT LOGIC CÁC CHỨC NĂNG

### 1. Dashboard (Bảng Điều Khiển Tổng Quan)
*   **Doanh thu:** Được cộng dồn từ tất cả các đơn hàng (Booking) có trạng thái là **"Đã thanh toán"**. Các vé "Đã hủy" hoặc "Chờ thanh toán" không được tính.
*   **Tỷ lệ lấp đầy rạp (Occupancy Rate):** `(Tổng số ghế đã bán / Tổng số ghế trong phòng chiếu) * 100%`. Logic này giúp rạp biết khung giờ nào/phim nào bị ế ghế để điều chỉnh lịch.
*   **Biểu đồ hoạt động:** Gom nhóm dữ liệu theo từng khung giờ (ví dụ nhóm các vé mua lúc 14h và 15h vào chung một cột mốc 14:00-16:00) để vẽ biểu đồ thống kê trực quan lượng khách trong ngày.

### 2. Quản Lý Phim (Movie Management)
*   **Media:** Poster, Backdrop và Trailer hiện đang được lưu dưới dạng chuỗi URL (đường dẫn ảnh/video). Backend có thể nhận chuỗi URL này hoặc làm endpoint upload file riêng. Backdrop dùng làm hình nền che mờ rất đẹp ở các trang chi tiết.
*   **Trạng thái phim:** 
    *   *Đang chiếu:* Khách hàng có thể đặt vé.
    *   *Sắp chiếu:* Khách có thể xem trailer nhưng chưa thể đặt vé.
    *   *Ngừng chiếu:* Phim bị ẩn khỏi trang chủ người dùng, nhưng vẫn lưu trong Database để xem thống kê cũ.
*   **Phân loại:** Độ tuổi (P, T13, T16, T18) và Thể loại để làm bộ lọc tự động cho trang chủ.

### 3. Quản Lý Cụm Rạp & Phòng Chiếu
*   **Trạng thái rạp:** Hoạt động, Chưa hoạt động, Ngừng hoạt động.
*   **Sơ đồ ghế ma trận:** 
    *   Admin nhập số **Hàng** và **Cột** (VD: 10x10), hệ thống tự sinh ra lưới 100 ghế (A1 -> J10).
    *   Admin có thể click vào từng ghế để đổi loại: Ghế thường, VIP, Sweetbox (ghế đôi).
    *   Admin có thể **vô hiệu hóa** các ghế (biến thành lối đi hoặc ghế hỏng) để khách không thể đặt. Dữ liệu này sẽ được lưu thành 1 mảng trạng thái gửi xuống Backend.

### 4. Quản Lý Lịch Chiếu (Showtime)
*   **Liên kết dữ liệu:** Mỗi một suất chiếu bắt buộc phải chứa `cinemaId` (rạp nào) và `movieId` (phim nào) để Backend dễ dàng query bằng Foreign Key.
*   **Lập lịch tự động (Auto-Schedule):** 
    *   Logic: `Giờ bắt đầu suất tiếp theo = Giờ chiếu suất trước + Thời lượng phim + 15 phút dọn rạp`. 
    *   Giúp admin tạo nhanh 10 suất chiếu liên tiếp cho các phim bom tấn mà không phải nhập tay từng suất.
*   **Xung đột:** Giao diện có thiết kế để so sánh thời gian, nếu admin xếp 2 phim cùng giờ trong cùng 1 phòng `(P1)`, hệ thống sẽ cảnh báo (Logic này cần Backend validate thêm khi save).

### 5. Quản Lý Đơn Hàng & Đặt Vé
*   **Tra cứu:** Tìm vé nhanh qua Mã Vé (Booking ID), SĐT hoặc Tên. Rất hữu ích cho nhân viên soát vé.
*   **Logic Đổi Vé:** Cho phép admin chọn lại `Phòng chiếu` và `Giờ chiếu` mới cho khách (trong trường hợp rạp bị lỗi kỹ thuật hoặc sự cố). 
*   **Logic Hủy / Hoàn tiền:** Đổi trạng thái vé sang "Đã hủy". Ở Backend, thao tác này sẽ gọi API của cổng thanh toán để refund tiền hoặc cộng điểm lại vào ví nội bộ cho khách.

### 6. Quản Lý Người Dùng & Phân Quyền
*   **Hạng thành viên (Tiers):** Standard, VIP, VVIP. Logic thăng hạng sẽ tự động quét biến `Tổng chi tiêu` của khách. Ví dụ: Chi tiêu trên 5 triệu thì tự động đổi thẻ VIP, hưởng ưu đãi giảm 5%.
*   **Khóa tài khoản:** Cờ `isActive` (Hoạt động/Đã khóa). Khách bị khóa sẽ không thể login mua vé (dùng xử lý các ca thông tin spam).
*   **Phân quyền Admin (Staff Roles):** 
    *   *Super Admin:* Toàn quyền.
    *   *Quản lý rạp:* Chỉ xem và thao tác trên dữ liệu lịch chiếu/vé của Cụm rạp mà họ được phân công.
    *   *CSKH:* Chỉ được xem đơn hàng, đổi/hủy vé và xem thông tin khách, không được can thiệp doanh thu.

### 7. Quản Lý Khuyến Mãi (Promotions)
*   **Phân loại giảm giá:** 
    *   `Percent`: Giảm % (Ví dụ giảm 20%, có thể cài thêm Giới hạn giảm tối đa là 50k).
    *   `Fixed`: Giảm tiền mặt thẳng (Ví dụ giảm 50.000đ).
*   **Phạm vi áp dụng (Rất quan trọng):** 
    *   Admin có thể chọn mã này chỉ dùng cho *mua vé xem phim*, hoặc dùng cho *toàn bộ đơn* (gồm cả bắp nước sau này).
    *   Admin có thể giới hạn mã chỉ dành cho tập khách hàng VIP, hoặc chỉ áp dụng khi xem tại một rạp cụ thể khai trương.
*   **Logic lượt dùng:** Mã có biến `Lượt sử dụng tối đa` và `Số lượt đã dùng`. UI sẽ hiển thị thanh Progress (Thanh tiến trình), khi đạt 100% mã tự động báo hết hạn.

### 8. Cấu Hình Hệ Thống (Settings)
*   **Tích điểm (Loyalty Points):** Admin cài đặt linh hoạt, ví dụ `10.000đ = 1 điểm`. Khi khách mua vé 100k, Backend tính phép chia lấy phần nguyên là ra số điểm thưởng.
*   **Cổng thanh toán:** Có nút chuyển đổi trạng thái `Sandbox` (Môi trường test) sang `Production` (Chạy thật trừ tiền thật) cho VNPay/MoMo/ZaloPay.
*   **Nhật ký hoạt động (Audit Logs):** Ghi lại toàn bộ lịch sử (Nhân viên nào -> Làm hành động gì -> Với đối tượng nào -> Lúc mấy giờ -> Địa chỉ IP). Phục vụ cho việc rà soát lỗi hoặc truy cứu trách nhiệm khi có dữ liệu bị xóa sai.

---
*Tất cả các form dữ liệu đã được làm chuẩn hóa theo dạng Object/Interface chặt chẽ (VD: thay vì dùng chữ hiển thị, hệ thống dùng các ID và Enum như `ticket_only`, `vip`, `active`...). Team Backend khi nhận code chỉ việc bóc các biến này lưu thẳng vào Database là xong.*
