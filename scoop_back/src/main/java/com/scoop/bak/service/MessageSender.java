package com.scoop.bak.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.scoop.bak.classes.Channel;

import jakarta.servlet.http.HttpSession;

@Component
public class MessageSender {
	
	public Channel chan1;
	public Channel chan2;
	public Map<String,Channel> chan;

	
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
	
	public void Send(String channel, String Message) throws IOException {
		ArrayList<WebSocketSession> soc;
		switch (channel) {
		case "A": 
			soc = chan1.getSubmembers();
			break;
		case "B":
			soc = chan2.getSubmembers();
			break;
		default:
			throw new IllegalArgumentException("Unexpected value: ");
		}
		if(soc != null) {
			for(WebSocketSession s : soc) {
				if(s.isOpen()) {
					
					s.sendMessage(new TextMessage(Message));
				}
			
			}
		}
	}
}
