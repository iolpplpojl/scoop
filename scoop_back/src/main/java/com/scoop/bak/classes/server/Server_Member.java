package com.scoop.bak.classes.server;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@IdClass(Server_MemberId.class)
public class Server_Member {
	@Id
	private Long serverId;
	@Id
	private Long memberId;
	
    @Column(columnDefinition = "DATE DEFAULT (CURDATE())")
	private Date enterDate;
}
