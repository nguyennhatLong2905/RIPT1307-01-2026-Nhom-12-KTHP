package com.example.THLTW.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void sendEmail(String to, String subject, String body) {
        if (brevoApiKey != null && !brevoApiKey.isEmpty()) {
            sendViaBrevo(to, subject, body, false);
            return;
        }

        if (mailSender == null) {
            System.err.println("Không có phương thức gửi mail nào được cấu hình!");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("Gửi email thành công qua SMTP tới: " + to);
        } catch (Exception e) {
            System.err.println("Gửi email qua SMTP thất bại: " + e.getMessage());
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (brevoApiKey != null && !brevoApiKey.isEmpty()) {
            sendViaBrevo(to, subject, htmlContent, true);
            return;
        }

        if (mailSender == null) {
            System.err.println("Không có phương thức gửi mail nào được cấu hình!");
            return;
        }

        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = 
                new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Gửi HTML email thành công qua SMTP tới: " + to);
        } catch (Exception e) {
            System.err.println("Gửi HTML email qua SMTP thất bại: " + e.getMessage());
        }
    }

    private void sendViaBrevo(String to, String subject, String content, boolean isHtml) {
        try {
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", Map.of("name", "Luxe Cinema", "email", fromEmail));
            payload.put("to", Collections.singletonList(Map.of("email", to)));
            payload.put("subject", subject);
            if (isHtml) {
                payload.put("htmlContent", content);
            } else {
                payload.put("textContent", content);
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Gửi email thành công qua Brevo tới: " + to);
            } else {
                System.err.println("Gửi email thất bại qua Brevo. Response: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Gửi email qua Brevo thất bại: " + e.getMessage());
        }
    }
}
