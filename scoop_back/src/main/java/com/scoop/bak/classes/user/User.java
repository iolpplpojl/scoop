package com.scoop.bak.classes.user;

import java.util.ArrayList;

import org.springframework.web.socket.WebSocketSession;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long identify_code; //식별코드
	
	@Column(nullable = false, unique = true)
	private String id; // id
	
	@Column(nullable = false)
	private String pwd; //pwd
	
	@Column(nullable = true)
	private String email;
	
	@Column(nullable = false)
	private String nickname;

}
