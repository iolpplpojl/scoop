package com.scoop.bak.classes.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FriendDTO {
	private Long identifyCode;
    private String email;
    private String nickname;
}
