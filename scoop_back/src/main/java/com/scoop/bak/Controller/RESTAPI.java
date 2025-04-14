package com.scoop.bak.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.chat.ChatroomDTO;
import com.scoop.bak.classes.chat.Chatroom_DM_DTO;
import com.scoop.bak.classes.chat.Message;
import com.scoop.bak.classes.chat.MessageDTO;
import com.scoop.bak.classes.server.Server;
import com.scoop.bak.classes.server.ServerDTO;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.FriendDTO;
import com.scoop.bak.classes.user.SignupRequest;
import com.scoop.bak.classes.user.User;
import com.scoop.bak.service.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;








//
@RequestMapping("/api")
@RestController
//@CrossOrigin(origins = "http://192.168.0.31:3000") // 프론트엔드 주소 허용
public class RESTAPI {
	
	Service serv;
	@Autowired
	RESTAPI(Service ser){
		serv = ser;
		
	}

	
	 /** 
	  * dm으로 포스트 요청이 오면 isExist()를 호출함
	  * isExist() = 둘간의 채팅방이 존재하면 그냥 원래 있던 방 번호 호출, 없으면 생성하고 번호를 돌려줌. (나중에 UUID로 수정해야 하지만, 지금은 일단 자동증가수 가져오게 함.)
	  * @param idenId 채팅 시작하는 쪽
	  * @param to 채팅 받는 쪽
	  * @return 채팅방 주소를 리턴
	  */
	@PostMapping("/dm")
	public ResponseEntity<?> dm(@RequestParam("id") String idenId, @RequestParam("to") String to)
	{
		String num = serv.DM_isExist(idenId, to);
		return ResponseEntity.ok().body(num);
	}
	
	@GetMapping("/dmlist")
	public  ResponseEntity<?> dmlist(@RequestParam("sub") Long sub){
		
		List<Chatroom_DM_DTO> dmlist = serv.findDmListBySub(sub); 
		return ResponseEntity.ok().body(dmlist);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam("id") String id, @RequestParam("pwd") String pwd, HttpServletResponse res) {
		User mem = serv.loadUserByEmail(id);
		if(mem == null) {
			return ResponseEntity.badRequest().body("로그인 처리 실패");
		}
		 BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		System.out.println(mem.getPwd()  + pwd);
		if(encoder.matches(pwd, mem.getPwd()))
		{
			System.out.println(mem.getNickname() + "의 로그인 처리 됨");
			res.addCookie(serv.createCookie(mem));

	        return ResponseEntity.ok()
	                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serv.genRefreshToken(mem))
	                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")  // 캐시 무효화
	                .header(HttpHeaders.PRAGMA, "no-cache")
	                .header(HttpHeaders.EXPIRES, "0")
	                .body("로그인 처리 완료");
		}
		return ResponseEntity.badRequest().body("로그인 처리 실패");
	}
	@GetMapping("/RefreshAccess") //엑서스토큰 갱신
	public ResponseEntity<?> Refresh(HttpServletRequest req)
	{
		Cookie[] coo = req.getCookies();
		if(coo == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰");
		}
		Cookie ref = null;
		for(Cookie c : coo) {
			System.out.println(c.getName() + "z");
			System.out.println(c.getValue());
			System.out.println(c.getAttributes());
			if(c.getName().equals("ref")) {
				ref = c;
				break;
			}
		}
		

		
			if(serv.Verify(ref != null ? ref.getValue() : ""))
			{
		        return ResponseEntity.ok()
		                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serv.genAccessToken(serv.loadUserByCode(serv.extractSub(ref))))	
		                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")  // 캐시 무효화
		                .header(HttpHeaders.PRAGMA, "no-cache")
		                .header(HttpHeaders.EXPIRES, "0")
		                .body("엑세스 처리 완료"); 
			}
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰");
	}
	
	
	@GetMapping("/VerifyAccess")
	public ResponseEntity<?> Verify(@RequestParam("key") String token)
	{
		System.out.println("bruh");
		if(serv.Verify(token)) {
	        return ResponseEntity.ok()
	                .body("유효한 토큰"); 
		};
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰");

	}
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody SignupRequest request) { 
		if(serv.registerUser(request)) {
			System.out.println(request);
	    	return ResponseEntity.ok("{\"status\":\"success\"}");
		}
		else {
	    	return ResponseEntity.badRequest().body("{\"status\":\"success\"}");

		}
	}

	
	@PostMapping("/getmessage") 
	public List<MessageDTO> getMessage(@RequestParam("id") String id){
		List<MessageDTO> msg = serv.loadMessageByChatRoomId(id);
		System.out.println(msg.toString());
		
		return msg;
	} 
	// 현재는 전체 메시지를 불러온다. 후에 메시지가 쌓이면 모든 메시지를 DTO화해서 로딩하게 되어버린다. 
	//메시지가 만개면 채팅 불러오는 유저마다 만 개의 메소드를 처리해야 한다. 
	//이 말은 즉 프론트엔드에서 인덱싱을 해서 0~100, 100~200(인덱스 0인 경우 가정) 하는 방식으로 메시지를 불러오는 게 필요하다.
	// 해당 최적화는 현재는 필요 없으므로 완성 하고도 시간 남으면 하기로.

	
	
	@PostMapping("/getchannels")
	public List<Integer> getChannels(){
		return null;
	}
	// 유저가 로그인 -> 서버를 누름 -> Chatroom select where 서버id =?;
	// ChatroomDTO 만들어서 ( 이름이랑 아이디, 타입만 있으면 될듯. ) 반환 
	// 프론트엔드는 받아서 li 생성
	// 누르면 서버아이디/채널아이디 이런식으로 수행;
	
	@GetMapping("/test")
	public ResponseEntity<?> test(){
		serv.DM_isExist("2","1");
		return ResponseEntity.ok().body("ㅋㅋ");
	}
	
	@PostMapping("/getchatrooms")
	public List<ChatroomDTO> getChatrooms(@RequestParam("id") String id){
		System.out.println(id);
		return serv.getChannelByServer(id);
	}
	
	@PostMapping("/getfriends")
	   public List<FriendDTO> getfriends(@RequestBody Map<String, Long> request) {
	       Long sub = request.get("sub");  // JSON에서 sub 값 추출
	       System.out.println("받은 sub 값: " + sub);  // sub 값 확인
	       List<FriendDTO> friends = serv.findFriendsBySub(sub);
	       return friends;
	}
	
	@PostMapping("/requestfriends")
	public List<FriendDTO> requestfriends(@RequestBody Map<String, Long> request){
		Long sub = request.get("sub");  // JSON에서 sub 값 추출
		System.out.println("받은 sub 값: " + sub);  // sub 값 확인
		List<FriendDTO> acceptfriends = serv.findRequestFriendsBySub(sub);
		return acceptfriends;
	}
	
	@PostMapping("/addfriend")
	public ResponseEntity<Map<String, String>> addfriend(@RequestBody Map<String, String> request) {
		 Long sub = Long.parseLong(request.get("sub"));
		 String friendCodeStr = request.get("friendCode");
		 Long friendCode;

		 if (friendCodeStr.matches("\\d+")) {
		     // 숫자만으로 이루어진 경우 → Long으로 직접 해석
		     friendCode = Long.parseLong(friendCodeStr);
		 } else {
		     // 이메일인 경우 → 서비스에서 코드 조회
		     friendCode = serv.getFriendCode(friendCodeStr);
		 }
		 
		 System.out.println(friendCode);
		 
		 if (sub == friendCode) {
			 return ResponseEntity.badRequest().body(Map.of("message", "자기 자신의 코드입니다."));
	     }
		 	
	     if (sub == null || friendCode == null) {
	         return ResponseEntity.badRequest().body(Map.of("message", "유효하지 않은 요청입니다."));
	     }
	     
	     Friend isFriend = serv.IsFriend(sub, friendCode);
	     
	     if (serv.findByIdentifyCode(friendCode)) {
	    	if(isFriend != null) {
	    		int state = isFriend.getState();// 거절 후 수락 중복처리 막기위해서 생성해놨음
	    		if(state == 0 || state == 1) {
		        	return ResponseEntity.status(404).body(Map.of("message", "이미 친구 요청이 되어 있습니다."));
				}
		        if(state == -1) {
		        	int update = serv.updateFriend(friendCode, sub, 0); // 거절당한 사람이 또 걸었을 때
		        	if(update == 0 ) {
		        		// 거절한 사람이 다시 걸 경우 만드는거 필요함! 이경우에는 updatefriend를 사용하면 건 사람이 요청도 받을수 있게 되므로
		        		// friendCode, sub 행을 지우고 serv.addFriend 를 하면 될 거 같음!
		        		// delete 필요 
		        		serv.deleteFriend(friendCode, sub);
		        		serv.addFriend(sub, friendCode);
		        	}
		        	return ResponseEntity.ok(Map.of("message", "친구 추가 성공"));
		        }
	
	    	}	
	        serv.addFriend(sub, friendCode);
	        return ResponseEntity.ok(Map.of("message", "친구 추가 성공"));
	            
	     } else {
	        return ResponseEntity.status(404).body(Map.of("message", "친구 코드가 존재하지 않습니다."));
	     }
		 		
	}
	
	
	@PostMapping("/updatefriend")
	public ResponseEntity<Map<String, String>> updatefriend(@RequestBody Map<String, Long> request) {
		 Long myCode = request.get("sub");
		 Long friendCode = request.get("identifyCode");
		 int state = request.get("state").intValue();
		 System.out.println("나의코드 " + myCode);
		 System.out.println("친구코드 " + friendCode);
		 System.out.println("변경할 상태 " + state);
		 
		 if(myCode == null || friendCode == null || !(state==1 || state == -1)) {
			 return ResponseEntity.status(404).body(Map.of("message", "오류 발생"));
		 }
		 
		 int result = serv.updateFriend(myCode, friendCode, state);
		 System.out.println(result);
		 if(result != 0) {
			 return ResponseEntity.ok(Map.of("message", "친구 업데이트 성공"));
		 }
		 
		 return ResponseEntity.status(404).body(Map.of("message", "오류 발생"));
	}
	
	@GetMapping("isfriend")
	public ResponseEntity<Map<String, Boolean>> isfriend(@RequestParam(name = "userId")Long userId, @RequestParam(name = "myId")Long myId) {
		System.out.println("우클릭 이벤트 실행됌!");
		System.out.println("!!!!!!!!!!!!!" + userId);
		System.out.println("!!!!!!!!!!!!!" + myId);
		Boolean state = false;
		Friend isfriend = serv.IsFriend(userId, myId);
		if(isfriend != null) {
			if(isfriend.getState() == 1) {
				state = true;
			}
		};

		return ResponseEntity.ok(Map.of("state", state));
	}
	
	@PostMapping("delete")
	public ResponseEntity<Map<String, String>> deleteFriend(@RequestBody Map<String, Long> request) {
		Long userId = request.get("userId");
        Long myId = request.get("myId");
        
        if (serv.updateStateFriend(userId, myId)) {
        	return ResponseEntity.ok(Map.of("message", "goooood"));
        }

        
        return ResponseEntity.status(404).body(Map.of("message", "오류 발생"));
	}
	/*
	@PostMapping("/find-id")
    public String findId(@RequestParam String email) {
        return serv.findId(email);
    }
	*/
	@PostMapping("/find-password")
	public ResponseEntity<String> findPassword(@RequestBody Map<String, String> request) {
	    String email = request.get("email");
	    return ResponseEntity.ok(serv.findPassword(email));
	}
	
	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody Map<String,String> request){
		String token=request.get("token");
		String newPassword=request.get("newPassword");
		  boolean result = serv.resetPassword(token, newPassword);
		    if (result) {
		        return ResponseEntity.ok("비밀번호 변경 완료");
		    } else {
		        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("토큰이 유효하지 않거나 만료됨");
		    }
	}
	
	
	
	
	@PostMapping("/addChatrooms")
	public ResponseEntity<?> addChatroom(@RequestParam("server_id") String serverid, @RequestParam("name") String name)
	{
		String num = serv.addChatrooms(serverid,name);
		return ResponseEntity.ok().body(num);
	}	
	
	
	@PostMapping("/getServers")
	public List<Server> getServers(@RequestParam("id") String name){
		return serv.getServers(name);
	}
	
	@PostMapping("/addServer")
	public ResponseEntity<?> addServer( @RequestParam("name") String name)
	{
		String num = serv.addChatServer(name);
		return ResponseEntity.ok().body(num);
	}	
}

