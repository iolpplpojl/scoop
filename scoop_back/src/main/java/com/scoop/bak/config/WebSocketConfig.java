package com.scoop.bak.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.scoop.bak.service.SocketHandler;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer{

	private final SocketHandler sock;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
	        registry.addHandler(sock, "/gateway")
	        .setAllowedOrigins("https://192.168.0.89:3000/");
	        
	    
	}

}
