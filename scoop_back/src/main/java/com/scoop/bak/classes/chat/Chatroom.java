package com.scoop.bak.classes.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Chatroom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; //식별자
	@Column(nullable = false)
	private int type;
	
	@Column(nullable = true)
	private Long ServerId;
	
	@Column(nullable = true)
	private String roomName;

	private boolean isPublic;
	
}
