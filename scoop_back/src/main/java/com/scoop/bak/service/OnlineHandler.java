package com.scoop.bak.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.scoop.bak.Repository.FriendRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.User;

@Component
public class OnlineHandler {

	ConcurrentHashMap<String, Long> lo;
	
	ConcurrentHashMap<Long,OnlineDTO> map;
	
	
	public OnlineHandler() {
		lo = new ConcurrentHashMap<String, Long>();
		map = new ConcurrentHashMap<>();
	}
	
	@Autowired
	UserRepo user;
	
	@Autowired
	FriendRepo friend;
	
	public void SetOnline(String user, WebSocketSession s) {
		Long l = Long.parseLong(user);
		OnlineDTO dto = new OnlineDTO(l,s);
		lo.put(s.getId(), l);
		map.put(l, dto);
		List<Friend> f = friend.findFriendsBySub(l);
		System.out.println(s.getId());
		
		
		for (Friend fr : f) {
			if(map.get(fr.getId()) != null){
				System.out.println("로그인 친구 이벤트");
			}
		}
		 
		
	}
	
	public void SetOffline(String user, WebSocketSession s) throws IOException {
		List<Friend> f = friend.findFriendsBySub(lo.get(s.getId()));

		for (Friend fr : f) {
			if(map.get(fr.getId()) != null){
				System.out.println("로그아웃 친구 이벤트");
			}
		}
		

		map.remove(lo.get(s.getId()));
		lo.remove(s.getId());
		
		System.out.println(map.size() + "zzzz");
		
	}
	
	
}
