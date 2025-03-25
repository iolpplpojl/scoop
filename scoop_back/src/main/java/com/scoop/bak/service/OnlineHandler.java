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
	
	public void SetOnline(String user, WebSocketSession s) throws IOException {
		Long l = Long.parseLong(user);
		OnlineDTO dto = new OnlineDTO(l,s);
		lo.put(s.getId(), l);
		map.put(l, dto);
		List<Friend> f = friend.findFriendsBySub(l);
		System.out.println(s.getId());
		
		OnlineDTO eventer = map.get(lo.get(s.getId()));

		for (Friend fr : f) {
			if(map.get(fr.getUserA()) != null && map.get(fr.getUserB()) != null){
				if(map.get(fr.getUserA()) != null && map.get(fr.getUserB()) != null){
					OnlineDTO user1 = map.get(fr.getUserA());
					OnlineDTO user2 = map.get(fr.getUserB());
					if(user1.getSub() == eventer.getSub()) {
						user2.getS().sendMessage(new TextMessage("친구 옴 " + eventer.getSub()));
					}
					else {
						user1.getS().sendMessage(new TextMessage("친구 옴 " + eventer.getSub()));
					}

				}

			}
			
		}
		 
		
	}
	/**
	 * 					map.get(fr.getId()).getS().sendMessage(new TextMessage(lo.get(s.getId()) + "로그아웃 했음."));

	 * @param user
	 * @param s
	 * @throws IOException
	 * 친구의 경우 번호, 상태, 유저1, 유저2.
	 * 그렇다면 친구가 "온라인일때"를 판별할려면, map에서 userA가 null이 아니고, map에서 userB가 null이 동시에 아닐때. ( 둘중 하나가 null이면 할 필요 없다. ) 
	 * 
	 * 메세지를 보내는 대상은 "들어오고 나간"사람을 제외해야함.
	 * "들어오고 나간" 사람은 lo에서 세션id검색 -> 유저 id 판별 -> 유저id 에서 온라인dto;
	 */
	public void SetOffline(String user, WebSocketSession s) throws IOException {
		List<Friend> f = friend.findFriendsBySub(lo.get(s.getId()));

		OnlineDTO eventer = map.get(lo.get(s.getId()));
		for (Friend fr : f) {
			if(map.get(fr.getUserA()) != null && map.get(fr.getUserB()) != null){
				OnlineDTO user1 = map.get(fr.getUserA());
				OnlineDTO user2 = map.get(fr.getUserB());
				if(user1.getSub() == eventer.getSub()) {
					user2.getS().sendMessage(new TextMessage("친구 나감 " + eventer.getSub()));
				}
				else {
					user1.getS().sendMessage(new TextMessage("친구 나감 " + eventer.getSub()));
				}

			}
		}
		

		map.remove(lo.get(s.getId()));
		lo.remove(s.getId());
		
		System.out.println(map.size() + "zzzz");
		
	}
	
	
}
