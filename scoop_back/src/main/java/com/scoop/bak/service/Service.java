package com.scoop.bak.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.Repository.MemberRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;
import com.scoop.bak.classes.user.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;

@org.springframework.stereotype.Service
public class Service implements UserDetailsService{
 private MemberRepo repo;
 private UserRepo repo_user;
 
 JwtUtil jwt;

 public MemberRes loadMemberByUserId( String i) {
	 MemberRes mem  = repo.findByUserId(i).orElse(null);
	 return mem;
 }
 
 
 public User loadUserByUserName(String i) {
	 User u = repo_user.findById(i).orElse(null);
	 return u;
 }
 
 public User loadUserByCode(String i) {
	 User u = repo_user.findByIdentifyCode(Long.parseLong(i)).orElse(null);
	 return u;
 }
 
 @Autowired
 public Service(MemberRepo rep, JwtUtil jw,UserRepo rep2) {
	 repo_user = rep2;
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

public Cookie createCookie(User mem) {
	Cookie coo = new Cookie("ref", genRefreshToken(mem));
	coo.setHttpOnly(true);
	coo.setSecure(true);
	coo.setPath("/");
	coo.setMaxAge(60*60*24*30);
	coo.setAttribute("SameSite", "None");
	return coo;
	
}

public String extractSub(Cookie coo) {
	return jwt.extractSub(coo.getValue());
}

public String genAccessToken(User mem) {
	 return jwt.genAccesToken(mem.getIdentifyCode().toString());
}	
public String genRefreshToken(User mem) {
	return jwt.genRefreshToken(mem);
}

public boolean Verify(String token) {
	return jwt.validateToken(token);
}
}
