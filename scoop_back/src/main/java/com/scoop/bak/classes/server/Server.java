package com.scoop.bak.classes.server;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Server {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long serverID;
	@Column(nullable = false)
	private String serverName;
}
