# Cấu trúc thư mục dự án - Luxe Cinema

```
Luxe Cinema/
├── README.md                          # Hướng dẫn cài đặt & chạy dự án
├── .gitignore                         # Các file/thư mục bỏ qua khi commit
│
├── frontend/                          # Next.js application (App Router)
│   ├── AGENTS.md                      # Hướng dẫn dành cho AI agent
│   ├── CLAUDE.md                      # Cấu hình cho Claude AI
│   ├── PROJECT_STRUCTURE.md           # File này - mô tả cấu trúc dự án
│   ├── app/                           # Định tuyến theo chuẩn Next.js App Router
│   │   ├── layout.tsx                 # Root layout toàn ứng dụng
│   │   ├── page.tsx                   # Trang chủ (/)
│   │   ├── globals.css                # Global styles
│   │   ├── admin/                     # Khu vực quản trị (/admin)
│   │   │   ├── layout.tsx             # Layout riêng cho admin
│   │   │   ├── page.tsx               # Dashboard tổng quan
│   │   │   ├── movies/                # Quản lý phim (/admin/movies)
│   │   │   ├── cinemas/               # Quản lý rạp chiếu (/admin/cinemas)
│   │   │   ├── rooms/                 # Quản lý phòng chiếu (/admin/rooms)
│   │   │   ├── showtimes/             # Quản lý suất chiếu (/admin/showtimes)
│   │   │   ├── tickets/               # Quản lý vé (/admin/tickets)
│   │   │   └── users/                 # Quản lý người dùng (/admin/users)
│   │   ├── ai-picks/                  # Gợi ý phim bằng AI (/ai-picks)
│   │   ├── bookings/                  # Trang đặt vé (/bookings)
│   │   ├── contact/                   # Trang liên hệ (/contact)
│   │   ├── forgot-password/           # Quên mật khẩu (/forgot-password)
│   │   ├── movies/                    # Danh sách phim
│   │   │   └── [id]/                  # Chi tiết phim theo ID (/movies/:id)
│   │   ├── my-list/                   # Danh sách phim yêu thích (/my-list)
│   │   ├── press/                     # Trang báo chí (/press)
│   │   ├── privacy/                   # Chính sách bảo mật (/privacy)
│   │   ├── profile/                   # Trang hồ sơ người dùng (/profile)
│   │   ├── register/                  # Đăng ký tài khoản (/register)
│   │   ├── reset-password/            # Đặt lại mật khẩu (/reset-password)
│   │   └── terms/                     # Điều khoản sử dụng (/terms)
│   │
│   ├── components/                    # Shared UI components
│   │   ├── layout/                    # Các component bố cục
│   │   │   ├── navbar.tsx             # Thanh điều hướng chính
│   │   │   ├── footer.tsx             # Footer toàn trang
│   │   │   └── splash-screen.tsx      # Màn hình loading khởi động
│   │   └── ui/                        # Primitive UI components (shadcn/ui)
│   │       ├── alert.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── radio-group.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── status-alert.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   │
│   ├── features/                      # Feature-based modules
│   │   ├── admin/                     # Module quản trị
│   │   │   ├── components/
│   │   │   │   ├── admin-charts.tsx        # Biểu đồ thống kê
│   │   │   │   ├── admin-sidebar.tsx       # Thanh sidebar admin
│   │   │   │   ├── cinema-management.tsx   # Quản lý rạp chiếu
│   │   │   │   ├── dashboard-stats.tsx     # Thống kê dashboard
│   │   │   │   ├── movie-management.tsx    # Quản lý phim
│   │   │   │   ├── room-management.tsx     # Quản lý phòng chiếu
│   │   │   │   ├── showtime-management.tsx # Quản lý suất chiếu
│   │   │   │   ├── ticket-management.tsx   # Quản lý vé
│   │   │   │   └── user-management.tsx     # Quản lý người dùng
│   │   │   ├── services/                   # API calls cho admin
│   │   │   └── index.ts
│   │   ├── auth/                      # Module xác thực
│   │   │   ├── components/
│   │   │   │   ├── forgot-password-form.tsx # Form quên mật khẩu
│   │   │   │   ├── profile-form.tsx         # Form chỉnh sửa hồ sơ
│   │   │   │   ├── register-form.tsx        # Form đăng ký
│   │   │   │   └── reset-password-form.tsx  # Form đặt lại mật khẩu
│   │   │   ├── services/                    # API calls cho auth
│   │   │   └── index.ts
│   │   ├── booking/                   # Module đặt vé
│   │   │   ├── components/
│   │   │   │   ├── booking-history.tsx  # Lịch sử đặt vé
│   │   │   │   ├── checkout-form.tsx    # Form thanh toán
│   │   │   │   ├── movie-details.tsx    # Thông tin phim khi đặt vé
│   │   │   │   ├── order-summary.tsx    # Tóm tắt đơn hàng
│   │   │   │   ├── seat-selector.tsx    # Chọn ghế ngồi
│   │   │   │   ├── showtime-selector.tsx # Chọn suất chiếu
│   │   │   │   └── ticket-card.tsx      # Thẻ vé sau khi đặt
│   │   │   ├── services/                # API calls cho booking
│   │   │   └── index.ts
│   │   ├── home/                      # Module trang chủ
│   │   │   ├── components/
│   │   │   │   ├── ai-picks.tsx         # Section gợi ý AI
│   │   │   │   ├── hero.tsx             # Section banner chính
│   │   │   │   ├── membership.tsx       # Section thành viên
│   │   │   │   └── trending.tsx         # Section phim thịnh hành
│   │   │   ├── services/                # API calls cho home
│   │   │   └── index.ts
│   │   ├── my-list/                   # Module danh sách yêu thích
│   │   │   └── components/
│   │   │       └── my-list-content.tsx  # Nội dung danh sách yêu thích
│   │   └── shared/                    # Components dùng chung giữa features
│   │       ├── components/
│   │       │   ├── movie-card.tsx       # Card hiển thị thông tin phim
│   │       │   └── search-bar.tsx       # Thanh tìm kiếm
│   │       └── index.ts
│   │
│   ├── constants/                     # Hằng số toàn ứng dụng
│   │   └── index.ts
│   ├── lib/                           # Utility functions & cấu hình
│   │   ├── auth-utils.ts              # Tiện ích xác thực (token, session)
│   │   ├── axios.ts                   # Cấu hình Axios instance
│   │   └── utils.ts                   # Hàm tiện ích chung
│   ├── types/                         # TypeScript type definitions
│   │   └── index.ts
│   ├── public/                        # Static assets (ảnh, icon, ...)
│   ├── next.config.ts                 # Cấu hình Next.js
│   ├── tsconfig.json                  # Cấu hình TypeScript
│   ├── postcss.config.mjs             # Cấu hình PostCSS
│   ├── eslint.config.mjs              # Cấu hình ESLint
│   ├── components.json                # Cấu hình shadcn/ui
│   └── package.json                   # Dependencies & scripts
│
└── backend/
    ├── README.md                      # Hướng dẫn riêng cho backend
    └── THLTW/                         # Spring Boot application
        ├── src/                       # Source code Java
        ├── pom.xml                    # Maven dependencies & build config
        ├── .env                       # Biến môi trường (KHÔNG commit lên git)
        ├── .env.example               # Template biến môi trường (để tham khảo)
        ├── docker-compose.yml         # Docker Compose cho Redis
        ├── mvnw                       # Maven Wrapper (Unix/Mac)
        └── mvnw.cmd                   # Maven Wrapper (Windows)
```
