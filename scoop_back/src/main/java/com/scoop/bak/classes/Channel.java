package com.scoop.bak.classes;

import java.util.ArrayList;

import org.springframework.web.socket.WebSocketSession;

import lombok.Getter;



@Getter
public class Channel {
	Long id;
	String name;
	ArrayList<WebSocketSession> submembers = new ArrayList<>();
}
