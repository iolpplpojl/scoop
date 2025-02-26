package com.scoop.bak.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.Repository.MemberRepo;
import com.scoop.bak.classes.Friend;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;

import jakarta.servlet.http.Cookie;

@org.springframework.stereotype.Service
public class Service implements UserDetailsService{
 private MemberRepo repo;
	JwtUtil jwt;

 public MemberRes loadMemberByUserId( String i) {
	 MemberRes mem  = repo.findByUserId(i).orElse(null);
	 return mem;
 }
 
 
 @Autowired
 public Service(MemberRepo rep, JwtUtil jw) {

	 repo = rep;
	 jwt = jw;
	  System.out.println(repo);
 }

@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	// TODO Auto-generated method stub
	MemberRes mem  = repo.findByUserId(username).orElseThrow(() -> new UsernameNotFoundException("유저가 없음"));
	return new MemberResDetails(mem);
}

public Cookie createCookie(MemberRes mem) {
	Cookie coo = new Cookie("ref", genRefreshToken(mem));
	coo.setHttpOnly(true);
	coo.setSecure(true);
	coo.setPath("/");
	coo.setMaxAge(60*60*24*30);
	coo.setAttribute("SameSite", "None");
	return coo;
	
}

public List<Friend> findFriendsBySub(String sub) {
	   List<String> friendsUserId = repo.findFriendUserIds(sub);
	   List<Friend> friends = new ArrayList<Friend>();
	   for(String a:friendsUserId) {
	      friends.add(repo.findUserInfo(a));
	   }
	   return friends;
}

public String extractSub(Cookie coo) {
	return jwt.extractSub(coo.getValue());
}
public String genAccessToken(MemberRes mem) {
	 return jwt.genAccesToken(mem.getUserId());
}	
public String genRefreshToken(MemberRes mem) {
	return jwt.genRefreshToken(mem);
}

public boolean Verify(String token) {
	return jwt.validateToken(token);
}
}
