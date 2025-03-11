package com.scoop.bak.classes.chat;

import java.sql.Date;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Entity
public class Message {
	@Id
	private Long id;
	private Long userID;
	private Long chatroomID;
	private String text;
	private LocalDateTime date;
	
}
