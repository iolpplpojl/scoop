package com.scoop.bak;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


//
@RestController
public class RESTAPI {
	
	Service serv;
	@Autowired
	RESTAPI(Service ser){
		serv = ser;
	}
	@PostMapping("/login")
	public MemberRes login(@RequestBody MemberRes Mem) {
		
		return Mem;
	}
}

