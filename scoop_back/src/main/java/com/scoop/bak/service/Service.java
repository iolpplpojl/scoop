package com.scoop.bak.service;

import java.util.Optional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.Repository.FriendRepo;
import com.scoop.bak.Repository.MemberRepo;
import com.scoop.bak.Repository.MessageRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;
import com.scoop.bak.classes.chat.Message;
import com.scoop.bak.classes.user.SignupRequest;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.FriendDTO;
import com.scoop.bak.classes.user.User;

import jakarta.servlet.http.Cookie;

@org.springframework.stereotype.Service
public class Service implements UserDetailsService{
 private MemberRepo repo;
 private UserRepo repo_user;
 private MessageRepo repo_mes;
 
 @Autowired
 private FriendRepo repo_friend;
 JwtUtil jwt;

 
 
 /** 
  * 채팅 입력
  * -> 저장
  * 채팅 불러오기 
  * -> 페이지 시작 시 (구독 시) -> serv에서 메시지 로딩 -> JSON묶음 return -> 프론트엔드에서 받아서 저장 -> 과정 완료 이전까지 채팅 입력 금지   
  */
 
 
 
 public List<Message> loadMessageByChatRoomId(String id){
	 Long room = Long.parseLong(id);
	 List<Message> msg = repo_mes.findByChatroomID(room);
	 
	 return msg;
 }
 
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
 public Service(MemberRepo rep, JwtUtil jw,UserRepo rep2, MessageRepo rep3) {
	 repo_mes = rep3;
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
	 return jwt.genAccesToken(mem.getIdentifyCode().toString(),mem.getNickname());
}	
public String genRefreshToken(User mem) {
	return jwt.genRefreshToken(mem);
}

public boolean Verify(String token) {
	return jwt.validateToken(token);
}
public boolean registerUser(SignupRequest request) {
    // 1. 중복 검사 (ID 기준)
    Optional<User> existingUser = repo_user.findById(request.getId());
    if (existingUser.isPresent()) {
    	System.out.println("중복ID");
        return false;
    }

   
    User newUser = new User();
    newUser.setId(request.getId());
    newUser.setPwd(request.getPwd());
    newUser.setEmail(request.getEmail());
    newUser.setNickname(request.getNickname());

    repo_user.save(newUser); // DB에 저장
    return true;
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
            users.add(new FriendDTO(user.getIdentifyCode() ,user.getId(), user.getNickname()));
        }
    }
    return users;
}

public List<FriendDTO> findRequestFriendsBySub(Long sub) {
	List<Long> requestfriends = repo_friend.findRequestFriendsByUserB(sub);
	List<FriendDTO> users = new ArrayList<>();
	for (Long requestfriend : requestfriends) {
		User user;
		user = repo_user.findById(requestfriend).orElse(null);
		users.add(new FriendDTO(user.getIdentifyCode(), user.getId(), user.getNickname()));
	}
	return users;
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


public Friend IsFriend(Long sub, Long friendCode) {
	return repo_friend.isFriend(sub, friendCode).orElse(null);
}


public int updateFriend(Long myCode, Long friendCode, int state) {
	return repo_friend.updateFriend(myCode,friendCode, state);
	
}


public int deleteFriend(Long sub, Long friendCode) {
	return repo_friend.deleteFriend(sub, friendCode);
	
}


}
