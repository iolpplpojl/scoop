package com.scoop.bak.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.Friend;
import com.scoop.bak.classes.MemberRes;

@Repository
public interface MemberRepo extends JpaRepository<MemberRes, Long> {
	
	Optional<MemberRes> findByUserId(String userId);
	
	 @Query(value = "SELECT friend_user_id FROM friends WHERE my_user_id = :myUserId AND state = 1", nativeQuery = true)
	 List<String> findFriendUserIds(@Param("myUserId") String myUserId);

	 @Query(value = "SELECT userid, nickname FROM users WHERE userid = :id", nativeQuery = true)
	 Friend findUserInfo(@Param("id") String id);
}
