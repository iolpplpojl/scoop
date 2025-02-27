package com.scoop.bak.classes.server;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Server_Role {
	@Id
	private Long RoleID;
	
	private Long ServerID;
	private String RoleName;
	private Long Rolebit;
	
}
