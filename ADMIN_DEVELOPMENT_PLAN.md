# Kế hoạch Phát triển & Phân chia Công việc: Module Admin (LUXE CINEMA)

Tài liệu này hướng dẫn chi tiết cách các thành viên trong nhóm phối hợp để xây dựng hoàn chỉnh trang Quản trị (Admin). 
**Nhánh (Branch) làm việc chung cho phần Admin:** `feature/admin` (hoặc tạo nhánh con từ nhánh này).

---

## Phân công Giai đoạn (Phases)

- **Giai đoạn 1:** Layout Admin & Dashboard (Module 1) - **[Người thực hiện: Nhat Long]** - *(Trạng thái: Đã hoàn thành)*
- **Giai đoạn 2:** Quản lý Phim, Rạp và Phòng Chiếu (Module 2, 3) - **[Người thực hiện: Linh]**
- **Giai đoạn 3:** Quản lý Lịch Chiếu & Đơn hàng (Module 4, 5) - **[Người thực hiện: Linh]**
- **Giai đoạn 4:** Người dùng, Khuyến mãi, Cài đặt & Tổng hợp (Module 6, 7, 8) - **[Người thực hiện: Nhat Long]**

---

## Hướng dẫn code cho Giai đoạn 2 & 3 (Dành cho Linh)

Để giữ cho code đồng bộ và đúng chuẩn, Linh khi thực hiện Giai đoạn 2 và 3 cần tuân thủ cấu trúc sau:

### 1. Cấu trúc Thư mục & Routing

Mọi trang con của Admin đều phải nằm trong `app/admin/...`. Bạn không cần phải tạo lại Layout, chỉ cần tạo file `page.tsx` cho tính năng của mình.

**Giai đoạn 2 (Quản lý Phim, Rạp):**
- Routing: 
  - `app/admin/movies/page.tsx` (Danh sách phim)
  - `app/admin/cinemas/page.tsx` (Danh sách rạp)
- Components logic: Tạo thư mục con nếu cần thiết:
  - `features/admin/components/movies/movie-table.tsx`
  - `features/admin/components/cinemas/cinema-form.tsx`

**Giai đoạn 3 (Quản lý Lịch chiếu, Đơn hàng):**
- Routing: 
  - `app/admin/showtimes/page.tsx` (Quản lý suất chiếu)
  - `app/admin/bookings/page.tsx` (Quản lý đơn đặt vé)
- Components logic: 
  - `features/admin/components/showtimes/showtime-calendar.tsx`
  - `features/admin/components/bookings/booking-list.tsx`

*Lưu ý: Mọi component bạn tạo ra trong `features/admin/components/` nên được export qua file `features/admin/index.ts` để tái sử dụng gọn gàng.*

### 2. Tiêu chuẩn viết Code (Bắt buộc)
- **Tuyệt đối KHÔNG ĐỂ LẠI COMMENT** trong mã nguồn (mọi thẻ `//` hay `/* */` đều phải bị xóa trước khi commit).
- **Tên biến, tên hàm, class:** Bắt buộc viết bằng Tiếng Anh (ví dụ: `const movieData = []`).
- **Nội dung hiển thị (UI):** Bắt buộc viết bằng Tiếng Việt có dấu (ví dụ: `<h2>Danh sách phim</h2>`).
- Không tự ý sửa đổi thư mục gốc `app/layout.tsx`.
- Không sửa file `sidebar.tsx` và `topbar.tsx` (Giai đoạn 1 đã làm sẵn).

### 3. Quy trình Commit & Push
1. Nhớ pull code mới nhất trước khi làm: `git pull origin feature/admin`
2. Chia nhỏ commit theo chức năng. Cú pháp bắt buộc:
   - `feat(admin): tao trang danh sach phim`
   - `feat(admin): form them moi suat chieu`
3. Đẩy code lên thường xuyên: `git push origin feature/admin`

---

## Chi tiết chức năng cần làm

### Giai đoạn 2 (Linh)
- **Module Quản lý Phim:**
  - Bảng danh sách phim (Lọc theo trạng thái Đang chiếu, Sắp chiếu).
  - Form Thêm/Sửa phim (Tên, đạo diễn, poster, thời lượng, độ tuổi).
- **Module Quản lý Rạp & Phòng chiếu:**
  - Bảng danh sách rạp.
  - Sơ đồ ma trận ghế ngồi cho từng phòng (Thường, VIP, Sweetbox).

### Giai đoạn 3 (Linh)
- **Module Lịch Chiếu:**
  - Giao diện chọn Phim -> Rạp -> Phòng -> Khung giờ.
  - Cảnh báo trùng lặp giờ chiếu tự động.
- **Module Đơn hàng:**
  - Tra cứu mã vé (Booking ID).
  - Giao diện hoàn vé, đổi suất chiếu cho khách hàng.
  