# BÁO CÁO HOÀN THIỆN: LUỒNG ĐẶT VÉ (BOOKING FLOW UI)

**Thành viên thực hiện:** Long
**Trạng thái:** Hoàn thành (UI Slicing & Routing)

---

## 1. Tóm tắt công việc
Đã hoàn thiện 100% giao diện cho 4 màn hình chính của luồng Đặt Vé theo đúng bản thiết kế mẫu (Premium Dark Theme, Vàng Gold `#DAB254`). Các màn hình đã được liên kết với nhau bằng luồng click cơ bản. Toàn bộ code tuân thủ nghiêm ngặt việc chia nhỏ Component và **không chứa comment rác**.

## 2. Các thư viện / Component cài đặt mới
Các thành viên khác sau khi `git pull` code mới về vui lòng lưu ý dự án có cài thêm các component của thư viện `shadcn/ui`. Nếu chạy dự án báo lỗi thiếu UI, vui lòng chạy lệnh sau ở terminal:
```bash
npx shadcn@latest add card separator tabs radio-group label scroll-area
```
*(Lưu ý: Dùng `shadcn` bản mới nhất, gói `shadcn-ui` cũ đã bị deprecated).*

## 3. Cấu trúc File & Các thay đổi quan trọng

### 3.1. Dữ liệu dùng chung (Đã cập nhật an toàn)
Để tránh conflict (xung đột) với file của các thành viên khác, các đoạn code dưới đây chỉ được nối thêm (append) vào cuối file:
- **`types/index.ts`**: Thêm Interface `Seat`, `BookingState`. (Giữ nguyên các export cũ của Leader).
- **`constants/index.ts`**: Thêm `MOCK_MOVIE`, `MOCK_THEATERS`, và tạo sơ đồ ghế `MOCK_SEATS` (12 cột ghế/hàng, tự động căn chỉnh lối đi). (Giữ nguyên biến `APP_NAME`).

### 3.2. Cấu trúc Page Routing (Thư mục `app/movies/[id]`)
Luồng chuyển trang đã được dựng sẵn bằng Next.js App Router:
- `[id]/page.tsx` : Màn 1 - Chọn Rạp & Suất chiếu
- `[id]/seats/page.tsx` : Màn 2 - Bản đồ Chọn Ghế Ngồi
- `[id]/checkout/page.tsx` : Màn 3 - Nhập thông tin Thanh toán
- `[id]/ticket/page.tsx` : Màn 4 - Trả kết quả Vé Điện Tử

### 3.3. Tổ chức UI Components (Thư mục `features/booking`)
Thay vì nhét chung vào thư mục `components` gốc, toàn bộ tính năng đặt vé được module hóa tại `features/booking/components` để team dễ quản lý:
- `movie-details.tsx`: Ảnh nền Poster và tóm tắt phim.
- `showtime-selector.tsx`: Tabs chọn ngày & list giờ chiếu.
- `seat-selector.tsx`: Sơ đồ ghế chuẩn màn hình chiếu.
- `order-summary.tsx`: Khung giỏ hàng nổi (Floating card).
- `checkout-form.tsx`: Form thanh toán tương tác thẻ tín dụng/Momo/Apple Pay.
- `ticket-card.tsx`: Card vé cắt góc cao cấp kèm mã QR.

## 4. Ghi chú Kỹ thuật & Đề xuất (Next Steps)
- **Luồng dữ liệu (State):** Hiện tại toàn bộ 4 màn hình đang hiển thị đẹp mắt nhưng hoạt động hoàn toàn bằng **Mock Data** cục bộ. 
- **Đề xuất cho Phase tiếp theo:** Trưởng nhóm hãy xem xét và thống nhất công cụ quản lý State (khuyến nghị dùng **Zustand** cho nhẹ hoặc React Context) để team có thể tái cấu trúc, đưa luồng dữ liệu lưu thông thật từ Màn 1 đến Màn 4 (bấm ghế nào thì qua màn thanh toán hiện giá tiền tương ứng).

*Code đã được check kỹ, sẵn sàng cho bước Code Review và Merge!*
