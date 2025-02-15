package com.scoop.bak.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scoop.bak.classes.TestMessage;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class SocketHandler implements WebSocketHandler {
	private final ObjectMapper mapper;
	
	@Autowired
	MessageSender sender;
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("some one is here.");
		session.sendMessage(new TextMessage("hi."));
	}

	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		// TODO Auto-generated method stub
		System.out.println(message.getPayload());
		JsonNode jn = mapper.readTree(message.getPayload().toString());
		switch (jn.get("type").asText()) 
		{
			case "ENTER_APP":	
				System.out.println(String.format("%s 유저가 입장헀습니다." , jn.get("writer")));
				break;
			case "ENTER_CHANNEL":
				sender.Register(jn.get("channel_id").asText(), session);
				break;
			case "SEND_MESSAGE":
				sender.Send(jn.get("writer").asText(),jn.get("channel_id").asText(),jn.get("text").asText());
				
				break;
		}
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("some one is not here.");

	}

	@Override
	public boolean supportsPartialMessages() {
		// TODO Auto-generated method stub
		return false;
	}

}
