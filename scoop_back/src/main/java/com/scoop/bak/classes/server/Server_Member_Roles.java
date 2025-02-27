package com.scoop.bak.classes.server;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Server_Member_Roles {
	@Id
	private Long serverId;
	@Id
	private Long memberId;
	@Id
	private Long roleId;
}
