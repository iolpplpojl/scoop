package com.scoop.bak.classes.chat;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Message {
	@Id
	private Long id;
	private Long userID;
	private Long chatroomID;
	private String text;
	private Date date;
	
}
