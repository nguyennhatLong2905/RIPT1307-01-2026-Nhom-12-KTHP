# 🎬 Luxe Cinema - Backend Setup Guide

Dự án Backend Spring Boot cung cấp API quản lý phim, suất chiếu, đặt vé và thống kê doanh thu cho hệ thống Luxe Cinema.

---

## 📋 Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Java Development Kit (JDK) 21**: Tải tại [Oracle](https://www.oracle.com/java/technologies/downloads/) hoặc dùng [SDKMAN!](https://sdkman.io/).
- **Maven 3.x**: Công cụ quản lý dự án và build.
- **MySQL 8.0+**: Hệ quản trị cơ sở dữ liệu.
- **Docker & Docker Compose** (Tùy chọn): Nếu bạn muốn chạy MySQL nhanh chóng qua container.

---

## ⚙️ Hướng dẫn cài đặt chi tiết

### 1. Cấu hình Cơ sở dữ liệu (MySQL)

#### Cách A: Cài đặt thủ công
- Mở MySQL Workbench hoặc Command Line.
- Tạo một database mới tên là `cinema_db`:
  ```sql
  CREATE DATABASE cinema_db;
  ```

#### Cách B: Sử dụng Docker (Nhanh nhất)
Nếu bạn đã cài Docker, chỉ cần chạy lệnh sau tại thư mục `backend/THLTW`:
```bash
docker-compose up -d
```
Lệnh này sẽ tự động khởi tạo một container MySQL với database `cinema_db` và mật khẩu root là `221226`.

### 2. Cấu hình Biến môi trường (Environment Variables)

Dự án sử dụng file `.env` để bảo mật thông tin nhạy cảm. 
1. Di chuyển vào thư mục code chính: `cd backend/THLTW`
2. Sao chép file mẫu: `cp .env.example .env` (hoặc copy-paste thủ công).
3. Mở file `.env` và cập nhật thông tin:
   - `DB_PASSWORD`: Mật khẩu MySQL của bạn.
   - `MAIL_USERNAME` & `MAIL_PASSWORD`: Tài khoản Gmail và [App Password](https://support.google.com/accounts/answer/185833?hl=vi) để gửi mail.

### 3. Chạy ứng dụng

Tại thư mục `backend/THLTW`, chạy lệnh:
```bash
./mvnw spring-boot:run
```
*(Trên Windows dùng `mvnw.cmd spring-boot:run` hoặc dùng IDE như IntelliJ IDEA / VS Code để chạy file `ThltwApplication.java`)*

Sau khi chạy thành công, backend sẽ hoạt động tại: `http://localhost:8080`

---

## 🚀 Kiểm tra & Tài liệu APIgit

Dự án tích hợp Swagger để bạn có thể xem và test API trực tiếp:
- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🔑 Tài khoản mặc định

| Vai trò | Tên đăng nhập | Mật khẩu |
| :--- | :--- | :--- |
| **Admin** | `admin` | `123456` |
| **User mẫu** | `user@example.com` | `123456` |

---

## 🛠️ Xử lý sự cố thường gặp (Troubleshooting)

1. **Lỗi phiên bản Java**: Đảm bảo lệnh `java -version` trả về bản 21.
2. **Lỗi kết nối MySQL**: Kiểm tra xem MySQL đã chạy chưa và `DB_URL` trong `.env` có đúng port không (mặc định 3306).
3. **Lỗi gửi Email**: Đảm bảo bạn đang dùng **App Password** của Gmail chứ không phải mật khẩu đăng nhập thông thường.
4. **Cập nhật database**: Ứng dụng dùng `ddl-auto: update`, các bảng sẽ tự động được tạo khi khởi chạy lần đầu.

---
*Chúc bạn phát triển dự án thuận lợi!* 🚀