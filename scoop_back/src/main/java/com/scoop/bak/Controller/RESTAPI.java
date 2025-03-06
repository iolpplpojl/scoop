package com.scoop.bak.Controller;

import java.awt.geom.CubicCurve2D;

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
import com.scoop.bak.classes.user.User;
import com.scoop.bak.service.Service;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//
@RequestMapping("/api")
@RestController
@CrossOrigin(origins = "http://211.212.129.132:3000") // 프론트엔드 주소 허용
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
	    serv.registerUser(request);
	    System.out.println(request);
	    return ResponseEntity.ok("{\"status\":\"success\"}");
	}


}

