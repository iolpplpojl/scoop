package com.scoop.bak.classes;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class MemberResDetails implements UserDetails {
	MemberRes mem;
	
	public MemberResDetails(MemberRes mem) {
		// TODO Auto-generated constructor stub
		this.mem = mem;
	}
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return mem.getUserPwd();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return mem.getUserId();
	}

}
