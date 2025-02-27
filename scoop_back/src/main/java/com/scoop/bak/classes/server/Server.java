package com.scoop.bak.classes.server;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Server {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ServerID;
	@Column(nullable = false)
	private String ServerName;
}
