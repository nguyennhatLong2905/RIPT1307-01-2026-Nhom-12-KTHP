package com.example.THLTW;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ThltwApplication {
	public static void main(String[] args) {
		SpringApplication.run(ThltwApplication.class, args);
	}
}
