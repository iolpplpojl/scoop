package com.scoop.bak.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scoop.bak.classes.chat.Chatroom;
import com.scoop.bak.classes.chat.ChatroomDTO;
import com.scoop.bak.classes.user.Friend;


@Repository
public interface ChatroomRepo extends JpaRepository<Chatroom, Long> {
	@Query("SELECT c FROM Chatroom c WHERE c.ServerId = :id")
	List<Chatroom> findChannelsByServerId(@Param("id") Long id);
	
	@Query("SELECT Count(c) from Chatroom c")
	int getCount();
}
