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
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@org.springframework.stereotype.Service
public class Service implements UserDetailsService{
 private MemberRepo repo;
	JwtUtil jwt;

 public MemberRes loadMemberByUserId( String i) {
	 MemberRes mem  = repo.findByUserId(i).orElse(null);
	 return mem;
 }
 
 @Autowired
 public Service(MemberRepo rep, 	JwtUtil jw) {

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

public String genAccessToken(MemberRes mem) {
	 return jwt.genAccessToken(mem);
}	
}
