package com.scoop.bak.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scoop.bak.Repository.FriendRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.chat.MessageDTO;
import com.scoop.bak.classes.chat.OnlineEventDTO;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.User;

@Component
public class OnlineHandler {
	private ObjectMapper mapper = new ObjectMapper();

	ConcurrentHashMap<String, Long> lo;
	
	ConcurrentHashMap<Long, ConcurrentHashMap<String, OnlineDTO>> map;
	
	
	public OnlineHandler() {
		lo = new ConcurrentHashMap<String, Long>();
		map = new ConcurrentHashMap<>();
	}
	
	@Autowired
	UserRepo user;
	
	@Autowired
	FriendRepo friend;
	
	/**
	 * 다클라 판단하기.
	 * 현재 구조 온라인 -> map에 새 유저 추가 -> event 일으킨 유저 map에서 가져옴 ->
	 * 
	 */
	
	public void SetOnline(String user, WebSocketSession s) throws IOException {
		Long l = Long.parseLong(user);
		OnlineDTO dto = new OnlineDTO(l,s);
		lo.put(s.getId(), l);
		
		map.putIfAbsent(l, new ConcurrentHashMap<String, OnlineDTO>());
		
		map.get(l).put(s.getId(), dto);
		
		
		List<Friend> f = friend.findFriendsBySub(l);
		System.out.println(s.getId());
		OnlineEventDTO aa =new OnlineEventDTO();
		aa.setId(l);
		aa.setIn(true);
		aa.setType("FRIENDINOUT");
        String jsonMessage = mapper.writeValueAsString(aa);

		OnlineDTO eventer = map.get(lo.get(s.getId())).get(s.getId());
        
		OnlineEventDTO aain =new OnlineEventDTO();
		aain.setIn(true);
		aain.setType("FRIENDINOUT");
        
        
		for (Friend fr : f) {
					ConcurrentHashMap<String, OnlineDTO> temp;

					if(fr.getUserA() == eventer.getSub()) {
						temp = map.get(fr.getUserB());
						aain.setId(fr.getUserB());
					}
					else {
						temp = map.get(fr.getUserA());
						aain.setId(fr.getUserA());
					}
					for(OnlineDTO onf : temp.values()) {
						onf.getS().sendMessage(new TextMessage(jsonMessage));
					}
					
				        String jsonMessagein = mapper.writeValueAsString(aain);
						eventer.getS().sendMessage(new TextMessage(jsonMessagein));

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

		OnlineDTO eventer = map.get(lo.get(s.getId())).get(s.getId());
		OnlineEventDTO aa =new OnlineEventDTO();
		aa.setId(eventer.getSub());
		aa.setIn(false);
		aa.setType("FRIENDINOUT");
		boolean isempty = false;
		map.get(eventer.getSub()).remove(s.getId());
		if(map.get(eventer.getSub()).isEmpty()) {
			lo.remove(s.getId());
			isempty = true;
		}
        String jsonMessage = mapper.writeValueAsString(aa);
		for (Friend fr : f) {
			ConcurrentHashMap<String, OnlineDTO> temp;

			if(fr.getUserA() == eventer.getSub()) {
				temp = map.get(fr.getUserB());
				aa.setId(fr.getUserB());
			}
			else {
				temp = map.get(fr.getUserA());
				aa.setId(fr.getUserA());
			}
			if(isempty) {
				for(OnlineDTO onf : temp.values()) {
					onf.getS().sendMessage(new TextMessage(jsonMessage));
				}
			}
		}

		
		System.out.println(map.size() + "zzzz");
		
	}
	
	
}
