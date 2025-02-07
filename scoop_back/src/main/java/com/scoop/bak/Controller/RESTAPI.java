package com.scoop.bak.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scoop.bak.JwtUtil;
import com.scoop.bak.classes.MemberRes;
import com.scoop.bak.service.Service;

//
@RequestMapping("/api")
@RestController
@CrossOrigin(origins = "http://192.168.0.82:3000") // 프론트엔드 주소 허용
public class RESTAPI {
	
	Service serv;
	@Autowired
	RESTAPI(Service ser){
		serv = ser;
		
	}
	@GetMapping("/login")
	public ResponseEntity<?> login(@RequestParam("id") String id, @RequestParam("pwd") String pwd) {
		System.out.println("id");
		MemberRes mem = serv.loadMemberByUserId(id);
		if(mem == null) {
			return ResponseEntity.badRequest().body("로그인 처리 실패");
		}
		System.out.println(mem.getUserPwd()  + pwd);
		if(mem.getUserPwd().equals(pwd))
		{
			System.out.println(mem.getUserId() + "의 로그인 처리 됨");
	        return ResponseEntity.ok()
	                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serv.genAccessToken(mem))
	                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")  // 캐시 무효화
	                .header(HttpHeaders.PRAGMA, "no-cache")
	                .header(HttpHeaders.EXPIRES, "0")
	                .body("로그인 처리 완료");
		}
		return ResponseEntity.badRequest().body("로그인 처리 실패");
		
		
	}
	
	
}

