package com.scoop.bak;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mysql.cj.xdevapi.SessionFactory;

@Repository
public interface MemberRepo extends JpaRepository<MemberRes, Long> {
	
	Optional<MemberRes> findByUserId(String userId);
}
