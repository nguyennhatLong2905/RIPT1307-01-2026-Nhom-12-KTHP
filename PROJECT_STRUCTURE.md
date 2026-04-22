# 🏗️ LUXE CINEMA — Kiến Trúc Dự Án

> **Tài liệu này mô tả cấu trúc thư mục chuẩn của dự án.**
> Mọi thành viên trong nhóm **BẮT BUỘC** phải đọc và tuân thủ trước khi code.

---

## 📁 Tổng quan cấu trúc

```
baseltww/
│
├── app/                        #    ROUTING — Chỉ Team Lead chỉnh sửa
│   ├── layout.tsx              #    Khung layout bọc toàn app (Navbar + Footer)
│   ├── page.tsx                #    Trang chủ — CHỈ import từ features/home
│   ├── globals.css             #    CSS toàn cục + Shadcn theme variables
│   └── favicon.ico             #    Icon tab trình duyệt
│
├── features/                   #    NƠI CÁC THÀNH VIÊN CODE
│   ├── home/                   #    Nhóm tính năng cho TRANG CHỦ
│   │   ├── components/         #    Các component giao diện
│   │   │   ├── hero.tsx        #    ➜ Banner chính / Hero section
│   │   │   ├── trending.tsx    #    ➜ Phim đang thịnh hành
│   │   │   ├── ai-picks.tsx    #    ➜ Gợi ý phim bằng AI
│   │   │   └── membership.tsx  #    ➜ Gói hội viên
│   │   └── index.ts            #    Barrel export — xuất tất cả component
│   │
│   └── shared/                 #    Component dùng chung giữa nhiều features
│       ├── components/
│       │   ├── movie-card.tsx   #    ➜ Card hiển thị thông tin phim
│       │   └── search-bar.tsx   #    ➜ Thanh tìm kiếm
│       └── index.ts            #    Barrel export
│
├── components/                 #    UI TĨNH — Dùng chung toàn hệ thống
│   ├── layout/                 #    Các thành phần bố cục cố định
│   │   ├── navbar.tsx          #    ➜ Thanh điều hướng trên cùng
│   │   └── footer.tsx          #    ➜ Chân trang
│   └── ui/                     #    Shadcn UI (KHÔNG SỬA THỦ CÔNG)
│       ├── button.tsx          #    ➜ Được tạo bởi: npx shadcn@latest add button
│       ├── badge.tsx           #    ➜ Được tạo bởi: npx shadcn@latest add badge
│       └── input.tsx           #    ➜ Được tạo bởi: npx shadcn@latest add input
│
├── constants/                  #   HẰNG SỐ & MOCK DATA
│   └── index.ts                #    Nơi lưu dữ liệu mẫu, hằng số dùng chung
│
├── types/                      # TYPESCRIPT INTERFACES
│   └── index.ts                #    Nơi định nghĩa kiểu dữ liệu dùng chung
│
├── lib/                        #  UTILITIES
│   └── utils.ts                #    Hàm tiện ích (cn, ...) — dùng bởi Shadcn
│
├── public/                     #  TÀI NGUYÊN TĨNH
│   ├── images/                 #    Ảnh poster phim, banner, ...
│   └── icons/                  #    Icon SVG tùy chỉnh
│
└── 📄 Config Files
    ├── package.json            #    Dependencies & scripts
    ├── tsconfig.json           #    Cấu hình TypeScript (alias @/ → ./)
    ├── next.config.ts          #    Cấu hình Next.js
    ├── components.json         #    Cấu hình Shadcn UI
    ├── postcss.config.mjs      #    Cấu hình PostCSS
    └── eslint.config.mjs       #    Cấu hình ESLint
```

---

## Phân chia công việc

### Ai code ở đâu?

| Thành viên | Thư mục được phép sửa | Mô tả |
|---|---|---|
| Tuan Hai | `features/home/components/hero.tsx` | Code giao diện Hero section |
| Huu Linh| `features/home/components/trending.tsx` | Code giao diện Trending section |
| Nhat Long| `features/home/components/ai-picks.tsx` | Code giao diện AI Picks section |
| Long + Linh | `features/home/components/membership.tsx` | Code giao diện Membership section |
| Dang Hieu |  | Backend |
| **Chung** | `features/shared/components/*` | Movie Card, Search Bar |
| **Chung** | `components/layout/*` | Navbar, Footer |
| **Chung** | `constants/index.ts` | Mock data |
| **Chung** | `types/index.ts` | TypeScript interfaces |

**KHÔNG** tự ý sửa các file trong `app/`, `components/ui/`, `lib/` trừ khi được Team Lead cho phép.

---

## Hướng dẫn Import

### Cách import ĐÚNG

```tsx
// Import feature components (dùng barrel export)
import { Hero, Trending, AiPicks, Membership } from "@/features/home";
import { MovieCard, SearchBar } from "@/features/shared";

// Import layout components
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Import constants & types
import { APP_NAME } from "@/constants";
```

### Cách import SAI (tránh dùng)

```tsx
// Đừng import trực tiếp vào file sâu bên trong features
import Hero from "@/features/home/components/hero";  // ← SAI

//  Dùng barrel export
import { Hero } from "@/features/home";              // ← ĐÚNG
```

---

## 🔄 Quy trình thêm Component mới

### 1. Thêm component vào feature

```bash
# Tạo file mới trong thư mục tương ứng
features/home/components/ten-component-moi.tsx
```

### 2. Export qua barrel file

```ts
// features/home/index.ts — thêm dòng export mới
export { default as TenComponentMoi } from "./components/ten-component-moi";
```

### 3. Import và sử dụng

```tsx
// app/page.tsx hoặc bất kỳ đâu
import { TenComponentMoi } from "@/features/home";
```

---

## 🧩 Thêm Shadcn UI Component mới

```bash
# Nếu gặp lỗi SSL, thêm tiền tố NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add [tên-component]

# Ví dụ:
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add card
NODE_TLS_REJECT_UNAUTHORIZED=0 npx shadcn@latest add dialog
```

> Component sẽ tự động được tạo trong `components/ui/`. **KHÔNG sửa thủ công** các file này.

---

## Lệnh khởi chạy

```bash
# Cài đặt thư viện (chạy 1 lần sau khi clone/pull)
npm install

# Khởi chạy dev server
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**
