package com.scoop.bak.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.Repository.FriendRepo;
import com.scoop.bak.Repository.MemberRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.FriendDTO;
import com.scoop.bak.classes.user.User;

import jakarta.servlet.http.Cookie;

@org.springframework.stereotype.Service
public class Service implements UserDetailsService{
 private MemberRepo repo;
 private UserRepo repo_user;
 
 @Autowired
 private FriendRepo repo_friend;
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

public List<FriendDTO> findFriendsBySub(Long sub) {
    List<Friend> friends = repo_friend.findFriendsBySub(sub); // identifyCode가 User1이나 User2인 friend들을 list로 반환
    List<FriendDTO> users = new ArrayList<>();

    for (Friend friend : friends) {
        User user;
        if (friend.getUserA().equals(sub)) {
            user = repo_user.findById(friend.getUserB()).orElse(null);
        } else {
            user = repo_user.findById(friend.getUserA()).orElse(null);
        }

        if (user != null) {
            users.add(new FriendDTO(user.getId(), user.getNickname()));
        }
    }
    return new ArrayList<>(users); // Set을 List로 변환하여 반환
}


public void addFriend(Long sub, Long identifyCode) {
	Friend friend = new Friend();
	friend.setState(0);
	friend.setUserA(sub);
	friend.setUserB(identifyCode);
	repo_friend.save(friend);
	
}


public boolean findByIdentifyCode(Long friendCode) {
	return repo_user.findByIdentifyCode(friendCode).isPresent();
}


public boolean IsFriend(Long sub, Long friendCode) {
	return repo_friend.isFriend(sub, friendCode).isPresent();
}

}
