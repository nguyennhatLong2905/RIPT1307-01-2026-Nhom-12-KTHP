# Luxe Cinema Backend

Dự án Spring Boot quản lý hệ thống rạp chiếu phim.

## Yêu cầu
- JDK 21
- Maven
- MySQL 8.0+ hoặc Docker

## Cài đặt
1. Cấu hình Database: Tạo cơ sở dữ liệu tên `cinema_db`.
2. Cấu hình Môi trường:
   - Copy file `.env.example` thành `.env` tại thư mục `backend/THLTW`.
   - Cập nhật các thông tin DB_PASSWORD, MAIL_USERNAME và MAIL_PASSWORD.

## Khởi chạy
Tại thư mục `backend/THLTW`, chạy lệnh:
```bash
./mvnw spring-boot:run
```
Ứng dụng sẽ chạy tại: http://localhost:8080

## Tài liệu API
Swagger UI: http://localhost:8080/swagger-ui/index.html

## Tài khoản mặc định
- Admin: admin / 123456
- User: user@example.com / 123456