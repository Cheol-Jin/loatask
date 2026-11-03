package com.example.vuespringlabbackend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 인증이 없는 관리용 등록/수정/삭제 API는 공개 배포에서 차단합니다.
@Configuration
@Profile("prod")
public class ProductionApiConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
                    throws Exception {
                if ("GET".equals(request.getMethod()) || "OPTIONS".equals(request.getMethod())) {
                    return true;
                }
                response.sendError(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
        }).addPathPatterns("/api/**");
    }
}
