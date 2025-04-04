package com.scoop.bak.service;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.scoop.bak.classes.chat.Message;
import com.scoop.bak.classes.chat.MessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.scoop.bak.Repository.MessageRepo;
import com.scoop.bak.classes.Channel;
import com.scoop.bak.classes.TestMessage;

import jakarta.servlet.http.HttpSession;

@Component
public class MessageSender {
	
	public List<Channel> ch;
	public Map<String,Channel> chan;
	
	@Autowired
	MessageRepo repo;
	
	MessageSender(){
		ch = new ArrayList<>();
		chan = new HashMap<String, Channel>();
		objectMapper.registerModule(new JavaTimeModule());
	}
	
	public void Register(String channel, WebSocketSession s) {
		if(chan.containsKey(channel)) {
			if(!chan.get(channel).getSubmembers().contains(s)) {
				chan.get(channel).getSubmembers().add(s);
			};
		}
		else {
			chan.put(channel, new Channel());
			if(!chan.get(channel).getSubmembers().contains(s)) {
				chan.get(channel).getSubmembers().add(s);
			};
		}
	}
    ObjectMapper objectMapper = new ObjectMapper();

	public void Send(String Writer,String channel, String Message, String UserId) throws IOException {
		LocalDateTime time = LocalDateTime.now();
        String jsonMessage = objectMapper.writeValueAsString(new MessageDTO("MESSAGE",null,Long.parseLong(UserId),Long.parseLong(channel),Message,time,Writer));
        System.out.println(jsonMessage);
		ArrayList<WebSocketSession> soc;
		soc = chan.get(channel).getSubmembers();
		if(soc != null) {
			for(WebSocketSession s : soc) {
				if(s.isOpen()) {
			        s.sendMessage(new TextMessage(jsonMessage));
				}
			}
		}
		
		
		Message msg = new Message(null,Long.parseLong(UserId),Long.parseLong(channel),Message,LocalDateTime.now());
		repo.save(msg);
	}
}
