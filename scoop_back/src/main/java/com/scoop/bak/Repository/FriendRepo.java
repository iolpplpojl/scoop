package com.scoop.bak.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.user.Friend;

@Repository
public interface FriendRepo extends JpaRepository<Friend, Long> {
	@Query("SELECT f FROM Friend f WHERE (f.userA = :identifyCode OR f.userB = :identifyCode) AND f.state = 1")
	List<Friend> findFriendsBySub(@Param("identifyCode") Long identifyCode);

}
