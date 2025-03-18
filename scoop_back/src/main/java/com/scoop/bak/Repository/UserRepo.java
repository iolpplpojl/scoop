package com.scoop.bak.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.user.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long>{
	Optional<User> findByIdentifyCode(Long id);
	Optional<User> findByEmail(String email);
}
