package com.scoop.bak.classes.server;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
public class Server_Member {
	@Id
	private Long serverId;
	@Id
	private Long memberId;
	private Date enterDate;
}
