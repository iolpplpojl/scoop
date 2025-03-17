package com.scoop.bak.classes.chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ChatroomDTO {
	int type;
	boolean isPublic;
	Long id;
	public String name;
	
}
