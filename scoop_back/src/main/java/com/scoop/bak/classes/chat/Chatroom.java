package com.scoop.bak.classes.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Getter
@Entity
public class Chatroom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; //식별자
	@Column(nullable = false)
	private int type;
	
	private Long ServerId;
	
	private String roomName;

	private boolean isPublic;
	
}
