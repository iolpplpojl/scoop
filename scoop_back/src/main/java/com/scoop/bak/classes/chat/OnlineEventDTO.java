package com.scoop.bak.classes.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OnlineEventDTO {
	private String type;
	
	
	private Long id;
	private boolean isIn; // true면 입장.
}
