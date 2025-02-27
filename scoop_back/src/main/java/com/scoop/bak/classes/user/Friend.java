package com.scoop.bak.classes.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Friend {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; //식별자
	
	@Column(nullable = false)
	private Long userA; //유저식별코드
	
	@Column(nullable = false)
	private Long userB; //유저식별코드
	
	int state;
	
	
}
