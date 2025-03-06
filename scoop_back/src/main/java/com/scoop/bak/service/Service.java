package com.scoop.bak.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.Repository.MemberRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;
import com.scoop.bak.classes.user.SignupRequest;
import com.scoop.bak.classes.user.User;

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
public void registerUser(SignupRequest request) {
    // 1. 중복 검사 (ID 기준)
    Optional<User> existingUser = repo_user.findById(request.getId());
    if (existingUser.isPresent()) {
        throw new RuntimeException("이미 존재하는 사용자 ID입니다.");
    }

   
    User newUser = new User();
    newUser.setId(request.getId());
    newUser.setPwd(request.getPwd());
    newUser.setEmail(request.getEmail());
    newUser.setNickname(request.getNickname());

    repo_user.save(newUser); // DB에 저장
}
}
