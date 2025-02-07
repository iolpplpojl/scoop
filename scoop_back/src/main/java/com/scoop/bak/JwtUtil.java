package com.scoop.bak;

import java.beans.JavaBean;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.scoop.bak.classes.MemberRes;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {


    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.accessTokenExpirationTime}")
    private long accessTokenExpirationTime;

    @Value("${jwt.refreshTokenExpirationTime}")
    private long refreshTokenExpirationTime;
    
    
    public String genAccessToken(MemberRes mem) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tempcode", UUID.randomUUID());
        claims.put("id", mem.getUserId());
        claims.put("logged-in", LocalDateTime.now().toString());
    	
    	 return Jwts.builder()
    			 .setClaims(claims)
    			 .setSubject(mem.getUserId())
    			 .setIssuedAt(new Date())
    			 .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationTime))
    			 .signWith(SignatureAlgorithm.HS256,secretKey)
    			 .compact();
    }	
    
    
}
