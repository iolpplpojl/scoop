package com.scoop.bak.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.user.Friend;

import jakarta.transaction.Transactional;

@Repository
public interface FriendRepo extends JpaRepository<Friend, Long> {
	@Query("SELECT f FROM Friend f WHERE (f.userA = :identifyCode OR f.userB = :identifyCode) AND f.state = 1")
	List<Friend> findFriendsBySub(@Param("identifyCode") Long identifyCode);
	
	@Query("SELECT f FROM Friend f " +
		       "WHERE (f.userA = :sub OR f.userB = :sub) " +
		       "AND (f.userA = :friendCode OR f.userB = :friendCode) ")
	Optional<Friend> isFriend(@Param("sub") Long sub, @Param("friendCode") Long friendCode);

	@Query("SELECT userA FROM Friend f WHERE f.userB = :identifyCode AND f.state = 0")
	List<Long> findRequestFriendsByUserB(@Param("identifyCode") Long identifyCode);
	
	@Modifying
	@Transactional
	@Query("UPDATE Friend f SET f.state = :state WHERE f.userA = :friendCode AND f.userB = :myCode")
    int updateFriend(@Param("myCode") Long myCode, @Param("friendCode") Long friendCode, @Param("state") int state);

	@Modifying
	@Transactional
	@Query("DELETE FROM Friend f WHERE f.userA = :userA AND f.userB = :userB")
	int deleteFriend(@Param("userA") Long userA, @Param("userB") Long userB);

	@Modifying
	@Query("UPDATE Friend f SET f.state = -1 WHERE (f.userA = :userA AND f.userB = :userB) OR (f.userA = :userB AND f.userB = :userA)")
	int updateFriendState(@Param("userA") Long userA, @Param("userB") Long userB);



}
