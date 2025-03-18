package com.scoop.bak.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.Repository.ChatroomDMRepo;
import com.scoop.bak.Repository.ChatroomRepo;
import com.scoop.bak.Repository.FriendRepo;
import com.scoop.bak.Repository.MemberRepo;
import com.scoop.bak.Repository.MessageRepo;
import com.scoop.bak.Repository.UserRepo;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.MemberResDetails;
import com.scoop.bak.classes.chat.Chatroom;
import com.scoop.bak.classes.chat.ChatroomDTO;
import com.scoop.bak.classes.chat.Chatroom_DM;
import com.scoop.bak.classes.chat.Message;
import com.scoop.bak.classes.chat.MessageDTO;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.FriendDTO;
import com.scoop.bak.classes.user.SignupRequest;
import com.scoop.bak.classes.user.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;

@org.springframework.stereotype.Service
public class Service implements UserDetailsService{
 private MemberRepo repo;
 private UserRepo repo_user;
 private MessageRepo repo_mes;
 private ChatroomRepo repo_cha;
 
 @Autowired
 private ChatroomDMRepo repo_cha_dm;
 
 @Autowired
 private FriendRepo repo_friend;
 
 @Autowired
 private PasswordEncoder passwordEncoder;  // BCryptPasswordEncoder 주입
 
 //@Autowired
 //private JavaMailSender mailSender;

 JwtUtil jwt;

 
 
 /** 
  * 채팅 입력
  * -> 저장
  * 채팅 불러오기 
  * -> 페이지 시작 시 (구독 시) -> serv에서 메시지 로딩 -> JSON묶음 return -> 프론트엔드에서 받아서 저장 -> 과정 완료 이전까지 채팅 입력 금지   
  */
 
 
 
 
public String DM_isExist(String start, String to) {
	Chatroom_DM dm = repo_cha_dm.findByUserName(Long.parseLong(start),Long.parseLong(to)).orElse(null);
	System.out.println(repo_cha.count());
	
	if(dm != null) {	
		System.out.println("이미 있삼.");
		return dm.getChatroomID().toString();
	}
	Chatroom c = new Chatroom();
	c.setType(1);
	c.setPublic(true);
	repo_cha.save(c);
	System.out.println(repo_cha.count());
	dm = new Chatroom_DM();
	dm.setChatroomID(repo_cha.count());
	dm.setUserA(Long.parseLong(start));
	dm.setUserB(Long.parseLong(to));
	repo_cha_dm.save(dm);
	
	return dm.getChatroomID().toString();
}
 
 
 public List<MessageDTO> loadMessageByChatRoomId(String id){
	 Long room = Long.parseLong(id);
	 List<Message> msg = repo_mes.findByChatroomID(room);
	 
	 List<MessageDTO> dto =new ArrayList<>();
	 for(Message m : msg) {
		 dto.add(new MessageDTO(m.getId(),m.getUserID(),m.getChatroomID(),m.getText(),m.getDate(), repo_user.findById(m.getUserID()).orElse(null).getNickname()));
	 }
	 return dto;
 }
 
 public MemberRes loadMemberByUserId( String i) {
	 MemberRes mem  = repo.findByUserId(i).orElse(null);
	 return mem;
 }
 
 
 public User loadUserByEmail(String i) {
	 User u = repo_user.findByEmail(i).orElse(null);
	 return u;
 }
 
 public User loadUserByCode(String i) {
	 User u = repo_user.findByIdentifyCode(Long.parseLong(i)).orElse(null);
	 return u;
 }
 
 
 
 public List<ChatroomDTO> getChannelByServer(String Id){
	 
	 Long lg = Long.parseLong(Id);
	 List<Chatroom> room = repo_cha.findChannelsByServerId(lg);
	List<ChatroomDTO> dto = new ArrayList<>();
	for(Chatroom r : room) {
		ChatroomDTO d = new ChatroomDTO();
		d.setId(r.getId());
		d.setName(r.getRoomName());
		d.setPublic(r.isPublic());
		d.setType(r.getType());
		dto.add(d);
		
	}
	 return dto;
 }
 
 @Autowired
 public Service(MemberRepo rep, JwtUtil jw,UserRepo rep2, MessageRepo rep3, ChatroomRepo rep4) {
	 repo_mes = rep3;
	 repo_user = rep2;
	 repo = rep;
	 repo_cha = rep4;
	 jwt = jw;
	  System.out.println(repo);
 }

 
 
 
 
 
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	// TODO Auto-generated method stub
	MemberRes mem  = repo.findByUserId(username).orElseThrow(() -> new UsernameNotFoundException("유저가 없음"));
    if (!passwordEncoder.matches(username, mem.getUserPwd())) {
        throw new UsernameNotFoundException("비밀번호가 일치하지 않습니다.");
    }

    // 비밀번호가 맞으면 UserDetails 객체 반환
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
    Optional<User> existingUser = repo_user.findByEmail(request.getEmail());
    if (existingUser.isPresent()) {
    	System.out.println("중복ID");
        return false;
    }
    // 2. 비밀번호 암호
    String encodedPassword = passwordEncoder.encode(request.getPwd());  // 비밀번호 암호화

    User newUser = new User();
    newUser.setPwd(encodedPassword);
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
            users.add(new FriendDTO(user.getIdentifyCode() ,user.getEmail(), user.getNickname()));
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
		users.add(new FriendDTO(user.getIdentifyCode(), user.getEmail(), user.getNickname()));
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

@Transactional
public boolean updateStateFriend(Long userId, Long myId) {
    int result = repo_friend.updateFriendState(userId, myId);
    return result == 1; // 업데이트 성공 여부 반환
}



public String findId(String email) {
    Optional<User> user = repo_user.findByEmail(email);
    if (user.isPresent()) {
        sendEmail(email, "아이디 찾기", "당신의 아이디는: " + user.get().getEmail());
        return "이메일로 아이디를 전송했습니다.";
    }
    return "해당 이메일로 등록된 계정이 없습니다.";
}

public String findPassword(String id, String email) {
    Optional<User> user = repo_user.findByEmail(email);
    if (user.isPresent()) {
        String resetToken = generateResetToken();
        String resetLink = "http://192.168.0.31/reset-password?token=" + resetToken;
        sendEmail(email, "비밀번호 재설정", "비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetLink);
        return "비밀번호 재설정 링크를 이메일로 전송했습니다.";
    }
    return "입력한 정보와 일치하는 계정이 없습니다.";
}
private void sendEmail(String to, String subject, String text) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);
        mailSender.send(message);
    } catch (MessagingException e) {
        throw new RuntimeException("이메일 전송 실패");
    }
}

private String generateResetToken() {
    return UUID.randomUUID().toString();
}
}
