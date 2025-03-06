package com.scoop.bak.classes.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SignupRequest {
	private String id;       
    private String pwd;      
    private String email;   
    private String nickname;
}
