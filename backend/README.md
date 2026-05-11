# Hệ thống Đặt vé Xem phim (Cinema Booking System)

Dự án Backend Spring Boot cung cấp API quản lý phim, suất chiếu, đặt vé và thống kê doanh thu.

## Công nghệ sử dụng
- Ngôn ngữ: Java 21
- Framework: Spring Boot
- Cơ sở dữ liệu: MySQL
- Bảo mật: Spring Security, JWT
- Thư viện: JPA, Spring Mail (SMTP), SpringDoc OpenAPI (Swagger)

## Tính năng chính
- Quản lý người dùng: Đăng ký, đăng nhập, phân quyền, khôi phục mật khẩu.
- Quản lý phim & phòng: CRUD thông tin phim, quản lý phòng và sơ đồ ghế.
- Suất chiếu: Lập lịch chiếu và cấu hình giá vé.
- Đặt vé: Quy trình chọn ghế và đặt vé trực tuyến.
- Gợi ý AI: Đề xuất phim dựa trên sở thích và lịch sử người dùng.
- Thống kê: Báo cáo doanh thu và số lượng vé toàn hệ thống.

## Cài đặt
1. Tạo database `cinema_db` trong MySQL.
2. Cấu hình `src/main/resources/application.yaml` (Database & Mail).
3. Chạy ứng dụng: `mvn spring-boot:run`

## API Documentation
- Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- API Docs: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

## Tài khoản mặc định
- Admin: `admin` / `123456`

---