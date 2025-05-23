package com.scoop.bak.classes.user;

import java.util.ArrayList;

import org.springframework.web.socket.WebSocketSession;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "identify_code")
	private Long identifyCode; //식별코드
	
	@Column(nullable = false)
	private String pwd; //pwd
	
	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(nullable = false)
	private String nickname;

	
	@Column(nullable = true)
	private String icon;

}
