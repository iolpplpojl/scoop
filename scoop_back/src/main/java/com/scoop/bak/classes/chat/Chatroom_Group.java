package com.scoop.bak.classes.chat;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity

public class Chatroom_Group {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ID;
	@Column(nullable = false)
	private Long ChatroomID;

	@Column(nullable = true)
	private String icon;
	
	private Date lastTalk;

}

