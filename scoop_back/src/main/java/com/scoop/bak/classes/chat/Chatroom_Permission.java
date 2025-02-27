package com.scoop.bak.classes.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Chatroom_Permission {

	@Id
	private Long ID;
	
	@Column(nullable = false)
	private Long ChatroomID;
	@Column(nullable = false)
	private Long RoleID;
	
}
