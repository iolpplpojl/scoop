package com.scoop.bak.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.chat.Chatroom;
import com.scoop.bak.classes.chat.Chatroom_DM;
import com.scoop.bak.classes.user.Friend;


@Repository
public interface ChatroomDMRepo extends JpaRepository<Chatroom_DM, Long>{
	
	@Query("SELECT c FROM Chatroom_DM c WHERE (c.userA = :id and c.userB = :id2) or (c.userA = :id2 and c.userB = :id) ")
	Optional<Chatroom_DM> findByUserName(@Param("id") Long usera, @Param("id2") Long userb);

	@Query("""
		    SELECT 
		        CASE 
		            WHEN c.userA = :sub THEN c.userB 
		            ELSE c.userA 
		        END 
		    FROM Chatroom_DM c 
		    WHERE c.userA = :sub OR c.userB = :sub
		    ORDER BY c.id
		""")
	List<Long> findSubListBySub(@Param("sub") Long sub);

	@Query("SELECT c.ChatroomID FROM Chatroom_DM c WHERE c.userA = :sub OR c.userB = :sub ORDER BY c.id")
    List<Integer> findChatroomidListBySub(@Param("sub") Long sub);
}
