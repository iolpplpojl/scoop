package com.scoop.bak.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 모든 경로에 대해 CORS 설정
        registry.addMapping("/**")
                .allowedOriginPatterns("*")  // 프론트엔드 도메인
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 필요한 메소드만 허용
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true)  // 자격증명(Credentials) 허용
                .exposedHeaders("Authorization");  // ✅ Authorization 헤더 노출
    }
}
