# BÁO CÁO NHÁNH LONG: TÍCH HỢP LUỒNG ĐẶT VÉ (BOOKING FLOW UI)

**Nhánh:** `long`  
**Trạng thái:** Hoàn thành (UI Slicing & Routing - Sẵn sàng Merge)

---

## 1. Tóm tắt chức năng
Nhánh `long` chứa toàn bộ UI cho luồng Đặt Vé (Booking Flow), bao gồm 4 màn hình chính được thiết kế theo Premium Dark Theme (với màu chủ đạo `#DAB254`). Các màn hình đã được liên kết với nhau bằng luồng click cơ bản thông suốt từ đầu đến cuối, không chứa comment rác (đã được đồng bộ thanh điều hướng và hình ảnh phim với nhánh của nhóm trưởng).

Ngoài ra, dự án có sử dụng thêm các component của thư viện `shadcn/ui`. Khi merge code, nếu gặp lỗi thiếu UI Component, vui lòng chạy lệnh sau để bổ sung:
```bash
npx shadcn@latest add card separator tabs radio-group label scroll-area
```

## 3. Cấu trúc File & Các thay đổi cần lưu ý khi Merge

### 3.1. Dữ liệu dùng chung (Không ghi đè, chỉ nối thêm)
Để tránh conflict, các đoạn code mới đã được **nối thêm (append)** vào cuối các file dùng chung:
- **`types/index.ts`**: Thêm Interface `Seat`, `BookingState` (Giữ nguyên các export cũ).
- **`constants/index.ts`**: Thêm `MOCK_MOVIE`, `MOCK_THEATERS`, và `MOCK_SEATS` (12 cột ghế/hàng, tự động căn chỉnh lối đi).

### 3.2. Cấu trúc Page Routing
Luồng chuyển trang được đặt tại thư mục `app/movies/[id]`:
- `[id]/page.tsx` : Màn 1 - Chọn Rạp & Suất chiếu
- `[id]/seats/page.tsx` : Màn 2 - Bản đồ Chọn Ghế Ngồi
- `[id]/checkout/page.tsx` : Màn 3 - Nhập thông tin Thanh toán
- `[id]/ticket/page.tsx` : Màn 4 - Trả kết quả Vé Điện Tử

### 3.3. Tổ chức UI Components
Toàn bộ tính năng đặt vé được module hóa tại `features/booking/components` để dễ quản lý và tái sử dụng:
- `movie-details.tsx` & `showtime-selector.tsx`
- `seat-selector.tsx` & `order-summary.tsx`
- `checkout-form.tsx` & `ticket-card.tsx`

## 4. Ghi chú Kỹ thuật (Technical Notes)
- **Điều hướng mượt mà (SPA Navigation):** Đã áp dụng `useRouter` của Next.js cho toàn bộ quá trình chuyển trang. Điều này giúp tối ưu hiệu năng và giữ nguyên trạng thái (state) khi người dùng dùng nút Back của trình duyệt, ngăn chặn lỗi 404 và mất state.
- **Client Components:** Đã cấu hình chuẩn `"use client"` cho các Component có sử dụng hook (`useState`, `useRouter`) để đảm bảo biên dịch an toàn trên Next.js App Router.
- **Quản lý State:** Hiện tại luồng UI sử dụng **Mock Data** nội bộ. Để dữ liệu xuyên suốt từ Màn 1 đến Màn 4 (chọn ghế -> tính tiền), đề xuất tích hợp **Zustand** hoặc React Context ở các bước tiếp theo.

*Code đã được test kỹ luồng chuyển trang, sẵn sàng cho bước Code Review và Merge vào nhánh chính!*
