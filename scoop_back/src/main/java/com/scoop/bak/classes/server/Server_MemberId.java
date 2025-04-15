package com.scoop.bak.classes.server;

import java.sql.Date;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Server_MemberId {
	private Long serverId;
	private Long memberId;
}
