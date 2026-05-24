# 🎬 Luxe Cinema

Ứng dụng đặt vé xem phim trực tuyến với giao diện hiện đại, được xây dựng bằng **Next.js** (Frontend) và **Spring Boot** (Backend).

## Tổng quan dự án

| Thành phần | Công nghệ | URL mặc định |
|---|---|---|
| Frontend | Next.js 16 + TypeScript | http://localhost:3000 |
| Backend | Spring Boot 4 + Java 21 | http://localhost:8080 |
| Database | MySQL | — |
| Cache | Redis | — |

---

## Yêu cầu hệ thống

### Frontend
- Node.js >= 18.x
- npm >= 9.x

### Backend
- Java 21 (JDK)
- Maven 3.9+ (hoặc dùng Maven Wrapper đi kèm)
- Docker & Docker Compose (tuỳ chọn, để chạy Redis local)

---

## Cài đặt và chạy Frontend

### 1. Cài dependencies

```bash
cd frontend
npm install
```

### 2. Khởi động server phát triển

```bash
npm run dev
```

Ứng dụng frontend sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### Các lệnh khác

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Khởi động server phát triển |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build production |
| `npm run lint` | Kiểm tra lỗi ESLint |

---

## Cài đặt và chạy Backend

### 1. Cấu hình biến môi trường

Tạo file `.env` tại thư mục `backend/THLTW/` dựa trên file mẫu:

```bash
cp backend/THLTW/.env.example backend/THLTW/.env
```

Sau đó mở file `.env` và điền đầy đủ các giá trị:

```env
# Database
DB_URL=jdbc:mysql://<host>:<port>/defaultdb?useSSL=true&allowPublicKeyRetrieval=true&verifyServerCertificate=false&serverTimezone=UTC
DB_USERNAME=<db_username>
DB_PASSWORD=<db_password>

# Mail (Gmail App Password)
MAIL_USERNAME=<email@gmail.com>
MAIL_PASSWORD=<app_password>

# Cloudinary (lưu trữ ảnh/video)
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

# Redis
REDIS_HOST=<redis_host>
REDIS_PORT=<redis_port>
REDIS_PASSWORD=<redis_password>
REDIS_SSL=true
```

### 2. Chạy bằng Maven Wrapper

**Linux / macOS:**

```bash
cd backend/THLTW
./mvnw spring-boot:run
```

**Windows:**

```bash
cd backend\THLTW
mvnw.cmd spring-boot:run
```

Backend sẽ chạy tại: [http://localhost:8080](http://localhost:8080)

### 3. Tài liệu API (Swagger UI)

```
http://localhost:8080/swagger-ui/index.html
```

### 4. Tài khoản mặc định

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Admin | admin | 123456 |
| User | user@example.com | 123456 |

---

## Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| Next.js | 16.2.4 | React framework với App Router |
| React | 19.2.4 | Thư viện UI |
| TypeScript | ^5 | Kiểm tra kiểu tĩnh |
| Tailwind CSS | ^4 | Utility-first CSS framework |
| shadcn/ui | ^4.3.1 | Component library |
| Framer Motion | ^12 | Animation library |
| Axios | ^1.16.0 | HTTP client |

### Backend

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| Spring Boot | 4.0.5 | Java application framework |
| Spring Security | — | Xác thực & phân quyền |
| Spring Data JPA | — | ORM & database access |
| MySQL | — | Cơ sở dữ liệu quan hệ |
| Redis | — | Cache & session store |
| JWT (jjwt) | 0.11.5 | JSON Web Token |
| Cloudinary | 1.36.0 | Lưu trữ ảnh/video |
| Lombok | — | Giảm boilerplate code |
| SpringDoc OpenAPI | 2.8.5 | Tự động sinh tài liệu API |

---

## Cấu trúc thư mục

Xem chi tiết tại [`frontend/PROJECT_STRUCTURE.md`](./frontend/PROJECT_STRUCTURE.md).

---

## Xử lý sự cố thường gặp

### `npm` không được nhận diện
Cài đặt Node.js từ [nodejs.org](https://nodejs.org) và khởi động lại terminal.

### Lỗi kết nối database
Kiểm tra lại giá trị `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` trong file `.env`.

### Port đã được sử dụng
- Frontend: Đổi port bằng `npm run dev -- -p 3001`
- Backend: Thêm `server.port=8081` vào `application.properties`
