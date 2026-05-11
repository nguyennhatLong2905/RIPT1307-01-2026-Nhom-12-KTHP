package com.example.THLTW.config;

import com.example.THLTW.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;

// Cấu hình các lớp bảo mật và phân quyền truy cập (Spring Security)
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // Bean hỗ trợ mã hoá mật khẩu cho người dùng
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Cấu hình quy tắc bảo vệ các URL của hệ thống
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF vì ứng dụng sử dụng Token
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Cấu hình chia sẻ tài nguyên (CORS) cho Frontend
            
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .logout(AbstractHttpConfigurer::disable)

            // Cài đặt chế độ phiên làm việc không trạng thái (Stateless)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Xử lý khi người dùng không có quyền truy cập
            .exceptionHandling(ex -> 
                ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )

            // Cấu hình quyền truy cập cụ thể cho từng URL
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Cho phép CORS Pre-flight
                .requestMatchers("/api/auth/**").permitAll()           
                .requestMatchers("/api/movies/my-ai-pick").authenticated() // Gợi ý cá nhân hóa phải login
                .requestMatchers("/api/movies/**").permitAll()         
                .requestMatchers("/api/showtimes/**").permitAll()      // Xem lịch chiếu phim là công khai
                .requestMatchers("/api/files/**").permitAll()          
                .requestMatchers("/error").permitAll()                  // Cho phép xem trang lỗi
                
                // Cho phép truy cập Swagger UI không cần login
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                
                // Phân quyền chi tiết dựa trên cấp bậc người dùng
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")      // Chỉ tài khoản ADMIN được phép
                .requestMatchers("/api/users/**").authenticated()       // Xem trang cá nhân phải đăng nhập
                .requestMatchers("/api/bookings/**").authenticated()    // Đăng nhập mới được phép đặt vé
                
                .anyRequest().authenticated()                           // Các yêu cầu khác mặc định phải Login
            )

            // Chèn thêm filter JWT vào quy trình xác thực
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}