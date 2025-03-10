package com.scoop.bak.Controller;

import java.awt.geom.CubicCurve2D;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.classes.user.SignupRequest;
import com.scoop.bak.classes.user.Friend;
import com.scoop.bak.classes.user.FriendDTO;
import com.scoop.bak.classes.user.User;
import com.scoop.bak.service.Service;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//
@RequestMapping("/api")
@RestController
//@CrossOrigin(origins = "http://192.168.0.82:3000") // 프론트엔드 주소 허용
public class RESTAPI {
	
	Service serv;
	@Autowired
	RESTAPI(Service ser){
		serv = ser;
		
	}
	

	@GetMapping("/login")
	public ResponseEntity<?> login(@RequestParam("id") String id, @RequestParam("pwd") String pwd, HttpServletResponse res) {
		System.out.println("id");
		User mem = serv.loadUserByUserName(id);
		if(mem == null) {
			return ResponseEntity.badRequest().body("로그인 처리 실패");
		}
		System.out.println(mem.getPwd()  + pwd);
		if(mem.getPwd().equals(pwd) )
		{
			System.out.println(mem.getId() + "의 로그인 처리 됨");
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
	public ResponseEntity<Map<String, String>> addfriend(@RequestBody Map<String, Long> request) {
		 Long sub = request.get("sub");
		 Long friendCode = request.get("friendCode");
		 
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
}

