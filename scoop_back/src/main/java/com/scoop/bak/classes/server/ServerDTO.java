package com.scoop.bak.classes.server;

import java.time.LocalDateTime;
import java.util.List;

import com.scoop.bak.classes.chat.ChatroomDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ServerDTO {
	public String ServerName;
	public Long ID;
	List<ChatroomDTO> channel;
}
