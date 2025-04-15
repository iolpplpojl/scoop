package com.scoop.bak.classes.server;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class Server_Role {
	@Id
	private Long roleID;
	
	private Long serverID;
	private String roleName;
	private Long rolebit;
	
}
