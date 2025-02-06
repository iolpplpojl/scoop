package com.scoop.bak;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
public class MemberRes {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long PKID;
	private String userId;
	private String userPwd;
	
}
