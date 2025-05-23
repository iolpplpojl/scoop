package com.scoop.bak;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import com.scoop.bak.classes.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {


    @Value("${jwt.secret}")
    private String secretKey;  //비밀키

    @Value("${jwt.accessTokenExpirationTime}")
    private long accessTokenExpirationTime; //엑세스토큰 유효기간

    @Value("${jwt.refreshTokenExpirationTime}")
    private long refreshTokenExpirationTime; // 리프레쉬토큰 유효기간
    Key key;

    
    @PostConstruct
    void init() {
       key = Keys.hmacShaKeyFor(secretKey.getBytes());

    }

    //리프레쉬 토큰 생성
    public String genRefreshToken(User mem) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tempcode", UUID.randomUUID());
        claims.put("id", mem.getIdentifyCode());
        claims.put("logged-in", LocalDateTime.now().toString());
    	
    	 return Jwts.builder()
    			 .setClaims(claims)
    			 .setSubject(mem.getIdentifyCode().toString())
    			 .setIssuedAt(new Date())
    			 .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationTime))
    			 .signWith(key, SignatureAlgorithm.HS256)
    			 .compact();
    }	
    
    
    //엑세스 토큰 인증
    public boolean validateToken(String token) {
        try {
        	JwtParser parse =Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build();
            String tokenSubject =
                    parse.parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            // 토큰의 사용자 ID가 일치하는지 확인
            System.out.println(parse.parseClaimsJws(token));
            return tokenSubject != null;
        } catch (ExpiredJwtException e) {
            // 토큰 만료
            return false;
        } catch (SignatureException e) {
            // 서명 오류
        	System.out.println("유효하지 않은 토큰");
            return false;
        } catch (Exception e) {
            // 기타 오류
            return false;
        }
    }
    public String extractSub(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)  // 서명 검증을 위한 키 설정
                    .build()
                    .parseClaimsJws(token)
                    .getBody();  // Claims 객체 (페이로드 부분)

            return claims.getSubject();  // "sub" 클레임 값 반환
        } catch (SignatureException e) {
            // 서명 오류 처리 (서명 키가 맞지 않거나 변조된 경우)
            throw new RuntimeException("Invalid JWT signature", e);
        } catch (Exception e) {
            // JWT 파싱 오류 처리
            throw new RuntimeException("Failed to parse JWT token", e);
        }
    }
    
    
    //엑세스 토큰 생성
    public String genAccesToken(String id,String name) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", name);
        claims.put("logged-in", LocalDateTime.now().toString());
    	
    	 return Jwts.builder()
    			 .setClaims(claims)
    			 .setSubject(id)
    			 .setIssuedAt(new Date())
    			 .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationTime))
    			 .signWith(key, SignatureAlgorithm.HS256)
    			 .compact();
    }
}
