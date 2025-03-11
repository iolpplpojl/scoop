package com.scoop.bak.service;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.scoop.bak.classes.chat.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scoop.bak.Repository.MessageRepo;
import com.scoop.bak.classes.Channel;
import com.scoop.bak.classes.TestMessage;

import jakarta.servlet.http.HttpSession;

@Component
public class MessageSender {
	
	public Channel chan1;
	public Channel chan2;
	public Map<String,Channel> chan;
	
	@Autowired
	MessageRepo repo;
	
	MessageSender(){
		chan1 = new Channel();
		chan2 = new Channel();
	}
	
	public void Register(String channel, WebSocketSession s) {
		switch (channel) {
		case "A": 
			if(!chan1.getSubmembers().contains(s)) {
				chan1.getSubmembers().add(s);
			}
			break;
		case "B":
			if(!chan2.getSubmembers().contains(s)) {
				chan2.getSubmembers().add(s);
			}
			break;
		default:
			throw new IllegalArgumentException("Unexpected value: ");
		}
	}
    ObjectMapper objectMapper = new ObjectMapper();

	public void Send(String Writer,String channel, String Message, String UserId) throws IOException {
        String jsonMessage = objectMapper.writeValueAsString(new TestMessage(Writer,channel,Message));
        System.out.println(jsonMessage);
		ArrayList<WebSocketSession> soc;
		switch (channel) {
		case "1": 
			soc = chan1.getSubmembers();
			break;
		case "2":
			soc = chan2.getSubmembers();
			break;
		default:
			throw new IllegalArgumentException("Unexpected value: ");
		}
		if(soc != null) {
			for(WebSocketSession s : soc) {
				if(s.isOpen()) {
			        s.sendMessage(new TextMessage(jsonMessage));
				}
			}
		}
		
		
		Message msg = new Message(null,Long.parseLong(UserId),Long.parseLong(channel),Message,LocalDateTime.now());
		repo.save(null)
	}
}
