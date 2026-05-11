# Base Code Lập Trình Web (Next.js & shadcn/ui)

Đây là base code đã được nâng cấp lên phiên bản Next.js và shadcn/ui mới nhất để sử dụng các component hiện đại.

## 🚀 Hướng dẫn khởi chạy

Sau khi clone dự án (hoặc pull code mới nhất) về máy, hãy chạy các lệnh sau:

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Khởi chạy môi trường Dev:**
   ```bash
   npm run dev
   ```
   Sau đó mở trình duyệt tại địa chỉ: `http://localhost:3000`

---

## 🧩 Hướng dẫn thêm Component mới (shadcn/ui)

Dự án này sử dụng [shadcn/ui](https://ui.shadcn.com/) làm core UI framework. Không cần tự viết CSS cho các base components, mà hãy thêm tự động qua lệnh CLI.

> **💡 LƯU Ý QUAN TRỌNG VỀ MẠNG (SSL CERTIFICATE ERROR):** 
> Nếu trong quá trình tải component, Terminal báo lỗi đỏ `unable to get local issuer certificate`, nguyên nhân do Node.js trên máy bạn/mạng chặn kiểm tra bảo mật.
> **Cách khắc phục:** LUÔN THÊM TIỀN TỐ `NODE_TLS_REJECT_UNAUTHORIZED=0` vào đầu các câu lệnh npx tĩnh.

**Cú pháp chuẩn để thêm component mới an toàn (dùng khi máy hay lỗi):**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add [tên-component]
```

**Ví dụ** Cài đặt Button, Card và Input:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add button
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add card
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add input
```
*Sau khi chạy, source code của giao diện sẽ tự động được tải vào trong thư mục `components/ui/` của dự án.*

---

## 🛠️ Hướng dẫn Khởi tạo gốc / Update Base Code
*(Dành cho Team Leader hoặc khi cần đập đi xây lại dự án từ số 0)*

> **⚠️ CẢNH BÁO:** Quy trình này sẽ **XÓA TOÀN BỘ CODE HIỆN TẠI** trong thư mục (trừ `.git`) và tạo lại bộ khung Next.js mới nhất. Chỉ sử dụng khi bạn cần dọn dẹp ổ đĩa, hoặc muốn upgrade lên bản framework mới nhất.

**Bước 1: Xóa sạch các file cũ (nhưng giữ nguyên lịch sử `.git`)**
```bash
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
```

**Bước 2: Cài đặt lại lõi Next.js mới nhất NGAY TẠI TẬP TIN HIỆN TẠI**
```bash
npx create-next-app@latest .
```
*(Bấm Enter mặc định `YES` cho các tùy chọn như TypeScript, ESLint, Tailwind CSS, App Router...)*

**Bước 3: Tích hợp Framework UI shadcn (kèm tiền tố chống lỗi SSL/TLS)**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest init
```
*(Khi hệ thống hiển thị bảng các lựa chọn, nên dùng thiết lập sau:)*
- Component library: Chọn **`Radix`**
- Style / Preset: Chọn **`Nova - Lucide / Geist`** *(Giao diện đẹp nhất hiện tại của Next.js 14-15)*
- Use CSS Variables: Bấm **`Yes`** để dễ làm màu Dark/Light Mode.
